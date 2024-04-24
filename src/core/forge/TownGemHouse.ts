import Credential from "../../util/Credential";
import GemFuseLog from "./GemFuseLog";
import GemFuseLogStorage from "./GemFuseLogStorage";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import TownGemHousePage from "./TownGemHousePage";
import _ from "lodash";
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

    async fuse(equipmentIndex: number, gemIndex: number, equipment?: string) {
        const request = this.#credential.asRequestMap();
        request.set("select", equipmentIndex.toString());
        request.set("baoshi", gemIndex.toString());
        request.set("azukeru", "0");
        request.set("mode", "BAOSHI_MAKE");
        const html = await NetworkUtils.post("town.cgi", request)
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
            await GemFuseLogStorage.getInstance().insert(log);
        } else if (text.includes("打造失败，所选装备报废！")) {
            const log = new GemFuseLog();
            log.roleId = this.#credential.id;
            log.gem = "七心";
            log.effort = 0;
            log.equipment = equipment;
            await GemFuseLogStorage.getInstance().insert(log);
        } else if (text.includes("所选装备成为齐心的装备")) {
            const log = new GemFuseLog();
            log.roleId = this.#credential.id;
            log.gem = "七心";
            log.effort = 1;
            log.equipment = equipment;
            await GemFuseLogStorage.getInstance().insert(log);
        } else if (text.includes("所选宠物蛋将加速孵化") && text.includes("点")) {
            const t = StringUtils.substringBetween(text, "所选宠物蛋将加速孵化", "点");
            const effort = _.parseInt(t);
            const log = new GemFuseLog();
            log.roleId = this.#credential.id;
            log.gem = "幸运";
            log.effort = effort;
            log.equipment = equipment;
            await GemFuseLogStorage.getInstance().insert(log);
        } else if (text.includes("所选装备提升幸运")) {
            const t = StringUtils.substringBetween(text, "所选装备提升幸运", "点");
            const effort = _.parseInt(t);
            const log = new GemFuseLog();
            log.roleId = this.#credential.id;
            log.gem = "幸运";
            log.effort = effort;
            log.equipment = equipment;
            await GemFuseLogStorage.getInstance().insert(log);
        } else if (text.includes("所选装备提升重量")) {
            const t = StringUtils.substringBetween(text, "所选装备提升重量", "点");
            const effort = _.parseInt(t);
            const log = new GemFuseLog();
            log.roleId = this.#credential.id;
            log.gem = "重量";
            log.effort = effort;
            log.equipment = equipment;
            await GemFuseLogStorage.getInstance().insert(log);
        }

    }

}

export {TownGemHouse};