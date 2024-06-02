import Credential from "../../util/Credential";
import {MapDashboardPage, MapDashboardPageParser} from "./MapDashboardPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import _ from "lodash";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("MAP");

class MapDashboard {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async open(): Promise<MapDashboardPage | null> {
        logger.debug("Loading map dashboard page...");
        const request = this.credential.asRequest();
        request.set("mode", "STATUS");
        const response = await PocketNetwork.post("status.cgi", request);
        // 并不能确认当前的位置，需要再次判断
        const dom = $(response.html);
        if (dom.find("select[name='chara_m']").length === 0) {
            // 没有移动步数的选择框，不在地图上
            logger.debug("No map dashboard available, ignore.");
            return null;
        }
        if (_.includes(response.html, "迪斯尼乐园")) {
            // 在地铁区域的地图上
            logger.debug("Metro dashboard found, ignore.");
            return null;
        }
        const page = MapDashboardPageParser.parse(response.html);
        response.touch();
        logger.debug("Map dashboard page loaded.", response.durationInMillis);
        return page;
    }
}

export {MapDashboard};