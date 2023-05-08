import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";
import CastleBankPage from "./CastleBankPage";
import Role from "../pocket/Role";
import StringUtils from "../util/StringUtils";

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string): CastleBankPage {
        return doParsePage(html);
    }

    async depositAll(): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("azukeru", "all");
                request.set("mode", "CASTLEBANK_SELL");
                NetworkUtils.post("castle.cgi", request)
                    .then(() => {
                        MessageBoard.publishMessage("在城堡银行存入全部现金。");
                        resolve();
                    });
            });
        };
        return await action();
    }
}

function doParsePage(html: string): CastleBankPage {
    const table = $(html).find("table:first")
        .find("tr:first td:first")
        .find("table:first")
        .find("tr:first")
        .next()
        .find("tr:first")
        .find("table:first")
        .find("tr:first td:first")
        .next()
        .next()
        .next()
        .find("table:first")
        .find("tr:first td:first")
        .find("table:first");

    const role = new Role();

    table.find("tr:first")
        .next()
        .find("td:first")
        .filter((_idx, td) => {
            role.name = $(td).text();
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.level = parseInt($(td).text());
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.attribute = StringUtils.substringBefore($(td).text(), "属");
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.career = $(td).text();
            return true;
        })
        .parent()
        .next()
        .find("td:first")
        .next()
        .filter((_idx, td) => {
            role.cash = parseInt(StringUtils.substringBefore($(td).text(), " GOLD"));
            return true;
        });

    const page = new CastleBankPage();
    page.role = role;
    return page;
}

export = CastleBank;