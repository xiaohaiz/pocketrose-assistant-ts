import {PocketLogger} from "../../pocket/PocketLogger";
import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import _ from "lodash";
import {MetroDashboardPage, MetroDashboardPageParser} from "./MetroDashboardPage";

const logger = PocketLogger.getLogger("METRO");

class MetroDashboard {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async open(): Promise<MetroDashboardPage | null> {
        logger.debug("Loading metro dashboard page...");
        const request = this.credential.asRequest();
        request.set("mode", "STATUS");
        const response = await PocketNetwork.post("status.cgi", request);
        // 并不能确认当前的位置，需要再次判断
        const dom = $(response.html);
        if (dom.find("select[name='chara_m']").length === 0) {
            // 没有移动步数的选择框，不在地图上
            logger.debug("No metro dashboard available, ignore.");
            return null;
        }
        if (!_.includes(response.html, "迪斯尼乐园")) {
            // 不在地铁区域的地图上
            logger.debug("Metro dashboard not found, ignore.");
            return null;
        }
        const page = MetroDashboardPageParser.parse(response.html);
        response.touch();
        logger.debug("Metro dashboard page loaded.", response.durationInMillis);
        return page;
    }

    /**
     * 返回枫丹
     */
    async returnToFontaine() {
        const request = this.credential.asRequest();
        request.set("townid", "12");
        request.set("mode", "MOVE");
        await PocketNetwork.post("status.cgi", request);
    }
}

export {MetroDashboard};