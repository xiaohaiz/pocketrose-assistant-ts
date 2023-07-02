import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import GemFuseLog from "./GemFuseLog";
import GemFuseLogStorage from "./GemFuseLogStorage";
import TownGemHousePage from "./TownGemHousePage";
import TownGemHouseParser from "./TownGemHouseParser";

class TownGemHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownGemHousePage> {
        const action = () => {
            return new Promise<TownGemHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("con_str", "50");
                request.set("mode", "BAOSHI_SHOP");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("town.cgi", request).then(html => {
                    new TownGemHouseParser(this.#credential, this.#townId).parse(html).then(page => resolve(page));
                });
            });
        };
        return await action();
    }

    async fuse(equipmentIndex: number, gemIndex: number): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", equipmentIndex.toString());
                request.set("baoshi", gemIndex.toString());
                request.set("azukeru", "0");
                request.set("mode", "BAOSHI_MAKE");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    const text = $(html).text();
                    if (text.includes("所选装备提升威力")) {
                        const t = StringUtils.substringBetween(text, "所选装备提升威力", "点");
                        const effort = _.parseInt(t);
                        const log = new GemFuseLog();
                        log.roleId = this.#credential.id;
                        log.gem = "威力";
                        log.effort = effort;
                        GemFuseLogStorage.getInstance().insert(log).then(() => {
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
        };
        return await action();
    }
}

export = TownGemHouse;