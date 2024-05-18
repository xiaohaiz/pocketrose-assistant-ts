import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownArmorHousePage from "./TownArmorHousePage";
import TownArmorHousePageParser from "./TownArmorHousePageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("ARMOR");

class TownArmorHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownArmorHousePage> {
        logger.debug("Loading armor store page....");
        const request = this.#credential.asRequest();
        request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "PRO_SHOP");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = await new TownArmorHousePageParser().parse(response.html);
        response.touch();
        logger.debug("Armor store page loaded.", response.durationInMillis);
        return page;
    }

    async sell(equipmentIndex: number, discount: number): Promise<void> {
        const request = this.#credential.asRequest();
        request.set("select", equipmentIndex.toString());
        request.set("val_off", discount.toString());
        request.set("mode", "SELL");
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async buy(merchandiseIndex: number, count: number, discount: number): Promise<void> {
        const request = this.#credential.asRequest();
        request.set("select", merchandiseIndex.toString());
        request.set("townid", this.#townId);
        request.set("val_off", discount.toString());
        request.set("mark", "1");
        request.set("mode", "BUY");
        request.set("num", count.toString());
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TownArmorHouse;