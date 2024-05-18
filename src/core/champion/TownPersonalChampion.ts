import Credential from "../../util/Credential";
import {PocketLogger} from "../../pocket/PocketLogger";
import {TownPersonalChampionPage, TownPersonalChampionPageParser} from "./TownPersonalChampionPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("CHAMPION");

class TownPersonalChampion {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<TownPersonalChampionPage> {
        logger.debug("Loading town personal champion page...");
        const request = this.credential.asRequest();
        if (this.townId) request.set("town", this.townId);
        request.set("con_str", "50");
        request.set("mode", "SINGLE_BATTLE");
        const response = await PocketNetwork.post("town.cgi", request);
        const original = TownPersonalChampionPageParser.parse(response.html);
        const page = await this.processNextStageButton(original);
        response.touch();
        logger.debug("Town personal champion page loaded.", response.durationInMillis);
        return page;
    }

    private async processNextStageButton(page: TownPersonalChampionPage): Promise<TownPersonalChampionPage> {
        if (!page.nextStage!) {
            // 已经没有继续下一场按钮了，直接返回即可
            return page;
        }
        const request = this.credential.asRequest();
        if (this.townId) request.set("town", this.townId);
        request.set("con_str", "50");
        request.set("mode", "SINGLE_BATTLE");
        const response = await PocketNetwork.post("town.cgi", request);
        return this.processNextStageButton(TownPersonalChampionPageParser.parse(response.html));
    }
}

export {TownPersonalChampion}