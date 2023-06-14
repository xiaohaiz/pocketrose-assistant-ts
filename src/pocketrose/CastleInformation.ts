import Castle from "../core/castle/Castle";
import Coordinate from "../util/Coordinate";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import CastleInformationPage from "./CastleInformationPage";

class CastleInformation {

    async open(): Promise<CastleInformationPage> {
        return await (() => {
            return new Promise<CastleInformationPage>(resolve => {
                NetworkUtils.get("castle_print.cgi").then(html => {
                    const page = CastleInformation.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async load(roleName: string): Promise<Castle> {
        return await (() => {
            return new Promise<Castle>((resolve, reject) => {
                this.open().then(page => {
                    const castle = page.findByRoleName(roleName);
                    if (castle === null) {
                        reject();
                    } else {
                        resolve(castle);
                    }
                });
            });
        })();
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
                castleList.push(castle);
            }
        });
        const page = new CastleInformationPage();
        page.castleList = castleList;
        return page;
    }

}

export = CastleInformation;