import Credential from "../../util/Credential";
import {TownDashboardPage, TownDashboardPageParser} from "../dashboard/TownDashboardPage";
import TownForgeHousePage from "./TownForgeHousePage";
import TownForgeHousePageParser from "./TownForgeHousePageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("FORGE");

class TownForgeHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownForgeHousePage> {
        logger.debug("Loading forge page...");
        const request = this.#credential.asRequest();
        if (this.#townId) request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "MY_ARM");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = await TownForgeHousePageParser.parse(response.html);
        response.touch();
        logger.debug("Forge page loaded.", response.durationInMillis);
        return page;
    }

    async repair(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "MY_ARM2");
        await PocketNetwork.post("town.cgi", request);
    }

    async repairAll(): Promise<TownDashboardPage> {
        const request = this.#credential.asRequest();
        request.set("arm_mode", "all");
        request.set("mode", "MY_ARM2");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = new TownDashboardPageParser(this.#credential).parse(response.html);
        response.touch();
        logger.debug("Repaired all equipments and dashboard page returned.", response.durationInMillis);
        return page;
    }

}

export = TownForgeHouse;