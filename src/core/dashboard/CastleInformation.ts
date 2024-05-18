import {CastleInformationPage, CastleInformationPageParser} from "./CastleInformationPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";
import {CacheObject, PocketCache} from "../../pocket/PocketCache";
import _ from "lodash";
import Castle from "../castle/Castle";
import Coordinate from "../../util/Coordinate";

const logger = PocketLogger.getLogger("CASTLE");

const CACHE_ID: string = "CastleInformation";
const TTL_IN_MILLIS: number = 300000;

class CastleInformation {

    async evictCache() {
        await PocketCache.deleteCacheObject(CACHE_ID);
    }

    async open(): Promise<CastleInformationPage> {
        logger.debug("Loading castle information page...");
        const response = await PocketNetwork.get("castle_print.cgi");
        const page = CastleInformationPageParser.parse(response.html);
        response.touch();
        logger.debug("Castle information page loaded.", response.durationInMillis);
        return page;
    }

    async openWithCache(): Promise<CastleInformationPage> {
        logger.debug("Loading castle information page (cache)...");
        const cache = await PocketCache.loadCacheObject(CACHE_ID);
        if (cache !== null) {
            logger.debug("Castle information cache hit.");
            return this.convertCacheToPage(cache);
        } else {
            logger.debug("Castle information cache miss.");
            const page = await this.open();
            if (page.castleList !== undefined) {
                const json = JSON.stringify(page.castleList);
                await PocketCache.writeCacheObject(CACHE_ID, json, TTL_IN_MILLIS);
                logger.debug("Castle information wrote into cache.");
            }
            return page;
        }
    }

    private convertCacheToPage(cache: CacheObject) {
        const documents = JSON.parse(cache.json!);
        const page = new CastleInformationPage();
        page.castleList = [];
        _.forEach(documents, doc => {
            const castle = new Castle();
            castle.name = doc.name;
            castle.owner = doc.owner;
            if (doc.coordinate) {
                const x = doc.coordinate.x;
                const y = doc.coordinate.y;
                castle.coordinate = new Coordinate(x, y);
            }
            castle.coordinate = doc.coordinate;
            castle.attribute = doc.attribute;
            castle.development = doc.development;
            castle.commerce = doc.commerce;
            castle.industry = doc.industry;
            castle.mineral = doc.mineral;
            castle.defense = doc.defense;
            page.castleList!.push(castle);
        });
        return page;
    }

}

export = CastleInformation;