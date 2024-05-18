import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";
import MessageBoard from "../../util/MessageBoard";
import OperationMessage from "../../util/OperationMessage";

const logger = PocketLogger.getLogger("LEAGUE");

class TownPetLeague {

    private readonly credential: Credential;
    private readonly townId: string;

    constructor(credential: Credential, townId: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open() {
        logger.debug("Loading pet league page...");
        const request = this.credential.asRequest();
        request.set("town", this.townId);
        request.set("con_str", "50");
        request.set("mode", "PET_TZ");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = TownPetLeaguePageParser.parse(response.html);
        response.touch();
        logger.debug("Pet league page loaded.", response.durationInMillis);
        return page;
    }

    /**
     * 登陆联赛
     */
    async register() {
        const request = this.credential.asRequest();
        request.set("town", this.townId);
        request.set("entry", "1");
        request.set("mode", "PET_TZ");
        // 还有一个name字段，猜测不是强制需要的
        const response = await PocketNetwork.post("town.cgi", request);
        const success = MessageBoard.processResponseMessage(response.html);
        return OperationMessage.newInstance(success);
    }
}

class TownPetLeaguePage {

    matchSituationURL?: string;
    leagueCandidateURL?: string;
    registration?: boolean;                 // 是否允许登陆联赛
    traditionalPetLeagueHTML?: string;

}

class TownPetLeaguePageParser {

    static parse(html: string) {
        const page = new TownPetLeaguePage();

        const dom = $(html);

        let a = dom.find("a:contains('查看战况')")
            .filter((_idx, e) => {
                const a = $(e);
                return a.text() === "查看战况";
            });
        if (a.length > 0) {
            page.matchSituationURL = a.attr("href");
        }

        a = dom.find("a:contains('候补队一览')")
            .filter((_idx, e) => {
                const a = $(e);
                return a.text() === "候补队一览";
            });
        if (a.length > 0) {
            page.leagueCandidateURL = a.attr("href");
        }

        const registerSubmit = dom.find("input:submit[value='登陆联赛']");
        page.registration = registerSubmit.length > 0;

        const tr = dom.find("input:submit[value='返回城市']")
            .closest("form")
            .closest("td")
            .parent();

        const td = tr.find("> td:first");
        td.find("> form").remove();
        td.find("> hr").remove();
        td.find("> p:last > table:first").remove();
        page.traditionalPetLeagueHTML = tr.html();

        return page;
    }

}

export {TownPetLeague, TownPetLeaguePage, TownPetLeaguePageParser};