import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import TownForgePage from "./TownForgePage";
import TownForgePageParser from "./TownForgePageParser";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import TownDashboardPageParser from "../dashboard/TownDashboardPageParser";
import TownDashboardPage from "../dashboard/TownDashboardPage";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("FORGE");

class TownForge {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownForgePage> {
        const request = this.#credential.asRequestMap();
        if (this.#townId) request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "MY_ARM");
        return new Promise<TownForgePage>(resolve => {
            NetworkUtils.post("town.cgi", request).then(html => {
                TownForgePageParser.parse(html).then(page => resolve(page));
            });
        });
    }

    async repair(index: number): Promise<string> {
        const request = this.#credential.asRequestMap();
        request.set("select", index.toString());
        request.set("mode", "MY_ARM2");
        return new Promise<string>(resolve => {
            NetworkUtils.post("town.cgi", request).then(html => resolve(html));
        });
    }

    async repairAll(): Promise<TownDashboardPage> {
        const request = this.#credential.asRequestMap();
        request.set("arm_mode", "all");
        request.set("mode", "MY_ARM2");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = new TownDashboardPageParser(this.#credential, response.html).parse();
        response.touch();
        logger.debug("Repaired all equipments and dashboard page returned.", response.durationInMillis);
        return page;
    }

}

export = TownForge;