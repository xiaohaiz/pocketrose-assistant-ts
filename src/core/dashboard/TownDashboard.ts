import Credential from "../../util/Credential";
import {TownDashboardPage, TownDashboardPageParser} from "./TownDashboardPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import MessageBoard from "../../util/MessageBoard";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TOWN");

class TownDashboard {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<TownDashboardPage | null> {
        const request = this.#credential.asRequest();
        request.set("mode", "STATUS");
        const response = await PocketNetwork.post("status.cgi", request);
        // 刷新这里，实际上已经有可能不在城市里了
        const dom = $(response.html);
        if (dom.find("input:submit[value='进入城堡']").length > 0) {
            // 不在城市在城堡了
            return null;
        }
        if (dom.find("select[name='chara_m']").length > 0) {
            // 已经出现了移动距离选择项，到了地图模式或者地铁区域
            return null;
        }
        const page = new TownDashboardPageParser(this.#credential).parse(response.html);
        response.touch();
        logger.debug("Town dashboard page loaded.", response.durationInMillis);
        return page;
    }

    async sendMessage(target: string, message: string): Promise<string> {
        const request = this.#credential.asRequest();
        request.set("mes_id", target);
        request.set("message", escape(message));
        request.set("mode", "MES_SEND");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        return response.html;
    }

}

export = TownDashboard;