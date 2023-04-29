import Castle from "./Castle";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import Coordinate from "../util/Coordinate";

class CastleLoader {

    static async getCastleList(): Promise<Castle[]> {
        const action = () => {
            return new Promise<Castle[]>(resolve => {
                NetworkUtils.sendGetRequest("castle_print.cgi", function (html: string) {
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
                    resolve(castleList);
                });
            });
        };
        return await action();
    }

}

export = CastleLoader;