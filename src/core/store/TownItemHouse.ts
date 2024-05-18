import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownItemHousePage from "./TownItemHousePage";
import TownItemHousePageParser from "./TownItemHousePageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("ITEM");

class TownItemHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownItemHousePage> {
        logger.debug("Loading item store page...");
        const request = this.#credential.asRequest();
        request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "ITEM_SHOP");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = TownItemHousePageParser.parsePage(response.html);
        response.touch();
        logger.debug("Item store page loaded.", response.durationInMillis);
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

    async buy(merchandiseIndex: number, count: number, discount: number) {
        const request = this.#credential.asRequest();
        request.set("select", merchandiseIndex.toString());
        request.set("townid", this.#townId);
        request.set("val_off", discount.toString());
        request.set("mark", "3");
        request.set("mode", "BUY");
        request.set("num", count.toString());
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TownItemHouse;