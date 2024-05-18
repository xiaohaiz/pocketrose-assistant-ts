import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import Castle from "../castle/Castle";
import StringUtils from "../../util/StringUtils";

class CastleInformationPage {

    castleList?: Castle[];

    findByRoleName(roleName: string) {
        for (const castle of this.castleList!) {
            if (castle.owner === roleName) {
                return castle;
            }
        }
        return null;
    }

    findByCoordinate(coordinate: Coordinate | string): Castle[] {
        let c: Coordinate;
        if (coordinate instanceof Coordinate) {
            c = coordinate;
        } else {
            c = Coordinate.parse(coordinate.toString());
        }
        const cs: Castle[] = [];
        if (!this.castleList) {
            return cs;
        }
        for (const castle of this.castleList) {
            if (!castle.coordinate) {
                continue;
            }
            if (c.equals(castle.coordinate)) {
                cs.push(castle);
            }
        }
        return cs;
    }

    get coordinateList(): string[] {
        const coordinates: string[] = [];
        if (!this.castleList) {
            return coordinates;
        }
        for (const castle of this.castleList) {
            if (!castle.coordinate) {
                continue;
            }
            const s = castle.coordinate.asText();
            if (!_.includes(coordinates, s)) {
                coordinates.push(s);
            }
        }
        return coordinates;
    }
}

class CastleInformationPageParser {

    static parse(html: string) {
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
                castle.development = CastleInformationPageParser.parseCastleNumber($(td).next().next().next().text());
                castle.commerce = CastleInformationPageParser.parseCastleNumber($(td).next().next().next().next().text());
                castle.industry = CastleInformationPageParser.parseCastleNumber($(td).next().next().next().next().next().text());
                castle.mineral = CastleInformationPageParser.parseCastleNumber($(td).next().next().next().next().next().next().text());
                castle.defense = CastleInformationPageParser.parseCastleNumber($(td).next().next().next().next().next().next().next().text());
                castleList.push(castle);
            }
        });
        const page = new CastleInformationPage();
        page.castleList = castleList;
        return page;
    }

    private static parseCastleNumber(s: string) {
        if (_.startsWith(s, "/")) {
            return 0;
        }
        const n = StringUtils.substringBefore(s, "/");
        return _.parseInt(n);
    }
}

export {CastleInformationPage, CastleInformationPageParser};