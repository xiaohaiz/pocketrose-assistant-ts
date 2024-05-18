import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownAccessoryHousePage from "./TownAccessoryHousePage";
import TownAccessoryHousePageParser from "./TownAccessoryHousePageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("ACCESSORY");

class TownAccessoryHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownAccessoryHousePage> {
        logger.debug("Loading accessory store page...");
        const request = this.#credential.asRequest();
        request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "ACC_SHOP");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = await new TownAccessoryHousePageParser().parse(response.html);
        response.touch();
        logger.debug("Accessory store page loaded.", response.durationInMillis);
        return page;
    }

    async sell(equipmentIndex: number, discount: number) {
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
        request.set("mark", "2");
        request.set("mode", "BUY");
        request.set("num", count.toString());
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TownAccessoryHouse;