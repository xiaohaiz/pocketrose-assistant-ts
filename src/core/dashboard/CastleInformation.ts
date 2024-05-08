import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import StringUtils from "../../util/StringUtils";
import Castle from "../castle/Castle";
import CastleInformationPage from "./CastleInformationPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("CASTLE");

class CastleInformation {

    async open(): Promise<CastleInformationPage> {
        const response = await PocketNetwork.get("castle_print.cgi");
        const page = CastleInformation.parsePage(response.html);
        response.touch();
        logger.debug("Castle information page loaded.", response.durationInMillis);
        return page;
    }

    static parsePage(html: string) {
        const castleList: Castle[] = [];
        $(html).find("td").each(function (_idx, td) {
            const text = $(td).text();
            if (text.endsWith(" (自购)")) {
                const name = $(td).prev().text();
                const owner = text.substring(0, text.indexOf(" (自购)"));
                let location = $(td).next().text();
                location = StringUtils.substringBetween(location, "(", ")");
                let x = StringUtils.substringBefore(location, ",");
                let y = StringUtils.substringAfter(location, ",");
                const coordinate = new Coordinate(parseInt(x), parseInt(y));

                const castle = new Castle();
                castle.name = name;
                castle.owner = owner;
                castle.coordinate = coordinate;
                castle.attribute = $(td).next().next().text();
                castle.development = CastleInformation.#parseCastleNumber($(td).next().next().next().text());
                castle.commerce = CastleInformation.#parseCastleNumber($(td).next().next().next().next().text());
                castle.industry = CastleInformation.#parseCastleNumber($(td).next().next().next().next().next().text());
                castle.mineral = CastleInformation.#parseCastleNumber($(td).next().next().next().next().next().next().text());
                castle.defense = CastleInformation.#parseCastleNumber($(td).next().next().next().next().next().next().next().text());
                castleList.push(castle);
            }
        });
        const page = new CastleInformationPage();
        page.castleList = castleList;
        return page;
    }

    static #parseCastleNumber(s: string) {
        if (_.startsWith(s, "/")) {
            return 0;
        }
        const n = StringUtils.substringBefore(s, "/");
        return _.parseInt(n);
    }
}

export = CastleInformation;