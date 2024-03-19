import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TimeoutUtils from "../../util/TimeoutUtils";

class MapExplorer {

    readonly #credential: Credential;


    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async explore() {
        const action = (credential: Credential) => {
            return new Promise<string>((resolve) => {
                MessageBoard.publishMessage("等待探险冷却中......(约52秒)");
                TimeoutUtils.execute(52000, function () {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["mode"] = "MAP_SEARCH";

                    NetworkUtils.sendPostRequest("map.cgi", request, function (html) {
                        if (html.includes("所持金超过1000000。请先存入银行。")) {
                            MessageBoard.publishMessage("在探险过程中，突然跳出<b style='color:chartreuse'>3个BT</b>对你进行了殴打！");
                            resolve("被3BT殴打！");
                        } else {
                            const found = $(html).find("h2:first").text();
                            MessageBoard.publishMessage("<b style='color:red'>" + found + "</b>");
                            resolve(found);
                        }
                    });
                });
            });
        };
        return await action(this.#credential);
    }

}

export = MapExplorer;