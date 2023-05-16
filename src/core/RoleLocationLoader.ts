import Credential from "../util/Credential";
import RoleLocation from "./RoleLocation";
import NetworkUtils from "../util/NetworkUtils";
import Coordinate from "../util/Coordinate";
import StringUtils from "../util/StringUtils";

class RoleLocationLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async load(): Promise<RoleLocation> {
        const action = (credential: Credential) => {
            return new Promise<RoleLocation>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.mode = "STATUS";
                NetworkUtils.sendPostRequest("status.cgi", request, function (pageHtml) {
                    let source = new Coordinate(-1, -1);
                    $(pageHtml)
                        .find("td")
                        .each(function (_idx, td) {
                            const text = $(td).text();
                            if (text.includes("现在位置(") && text.endsWith(")")) {
                                const s = StringUtils.substringBetween(text, "(", ")");
                                const x = StringUtils.substringBefore(s, ",");
                                const y = StringUtils.substringAfter(s, ",");
                                source = new Coordinate(parseInt(x), parseInt(y));
                            }
                        });
                    const location = new RoleLocation();
                    location.coordinate = source;
                    resolve(location);
                });
            });
        };
        return await action(this.#credential);
    }
}

export = RoleLocationLoader;