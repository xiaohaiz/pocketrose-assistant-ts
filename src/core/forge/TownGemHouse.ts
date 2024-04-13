import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import GemFuseLog from "./GemFuseLog";
import GemFuseLogStorage from "./GemFuseLogStorage";
import TownGemHousePage from "./TownGemHousePage";
import {TownGemHousePageParser} from "./TownGemHousePageParser";

class TownGemHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownGemHousePage> {
        const request = this.#credential.asRequestMap();
        request.set("con_str", "50");
        request.set("mode", "BAOSHI_SHOP");
        if (this.#townId !== undefined) {
            request.set("town", this.#townId);
        }
        const html = await NetworkUtils.post("town.cgi", request);
        const parser = new TownGemHousePageParser(this.#credential, this.#townId);
        return parser.parsePage(html);
    }

    async fuse(equipmentIndex: number, gemIndex: number, equipment?: string): Promise<void> {
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
                        log.equipment = equipment;
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