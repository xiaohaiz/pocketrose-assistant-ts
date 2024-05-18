import TownStatus from "../town/TownStatus";
import {TownInformationPage, TownInformationPageParser} from "./TownInformationPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {CacheObject, PocketCache} from "../../pocket/PocketCache";
import _ from "lodash";

const logger = PocketLogger.getLogger("TOWN");

const CACHE_ID: string = "TownInformation";

class TownInformation {

    async open(): Promise<TownInformationPage> {
        const response = await PocketNetwork.get("town_print.cgi");
        const page = TownInformationPageParser.parse(response.html);
        response.touch();
        logger.debug("Town information page loaded.", response.durationInMillis);
        return page;
    }

    /**
     * 缓存数据只有城市名称及其对应的国家这两项有效，其余字段的数据不能保证准确，没有意义。
     */
    async openWithCache(): Promise<TownInformationPage> {
        logger.debug("Loading town information page (cache)...");
        const cache = await PocketCache.loadCacheObject(CACHE_ID);
        if (cache !== null) {
            logger.debug("Town information cache hit.");
            return this.convertCacheToPage(cache);
        } else {
            logger.debug("Town information cache miss.");
            const page = await this.open();
            if (page.statusList !== undefined) {
                const json = JSON.stringify(page.statusList);
                await PocketCache.writeCacheObject(CACHE_ID, json, PocketCache.expirationUntilTomorrow());
                logger.debug("Town information wrote into cache.");
            }
            return page;
        }
    }

    private convertCacheToPage(cache: CacheObject) {
        const documents = JSON.parse(cache.json!);
        const page = new TownInformationPage();
        page.statusList = [];
        _.forEach(documents, doc => {
            const status = new TownStatus();
            status.name = doc.name;
            status.country = doc.country;
            page.statusList!.push(status);
        });
        page.initialize();
        return page;
    }

}

export = TownInformation;