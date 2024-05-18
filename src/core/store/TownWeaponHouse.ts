import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownWeaponHousePage from "./TownWeaponHousePage";
import TownWeaponHousePageParser from "./TownWeaponHousePageParser";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("WEAPON");

class TownWeaponHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownWeaponHousePage> {
        logger.debug("Loading weapon store page...");
        const request = this.#credential.asRequest();
        request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "ARM_SHOP");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = await new TownWeaponHousePageParser().parse(response.html);
        response.touch();
        logger.debug("Weapon store page loaded.", response.durationInMillis);
        return page;
    }

    async buy(index: number, count: number, discount: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("townid", this.#townId);
        request.set("val_off", discount.toString());
        request.set("mark", "0");
        request.set("mode", "BUY");
        request.set("num", count.toString());
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async sell(index: number, discount: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("val_off", discount.toString());
        request.set("mode", "SELL");
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

}

export = TownWeaponHouse;