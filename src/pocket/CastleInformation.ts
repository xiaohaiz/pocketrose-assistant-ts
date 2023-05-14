import Castle from "../common/Castle";
import Coordinate from "../util/Coordinate";
import StringUtils from "../util/StringUtils";
import CastleInformationPage from "./CastleInformationPage";

class CastleInformation {

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
                castleList.push(castle);
            }
        });
        const page = new CastleInformationPage();
        page.castleList = castleList;
        return page;
    }

}

export = CastleInformation;