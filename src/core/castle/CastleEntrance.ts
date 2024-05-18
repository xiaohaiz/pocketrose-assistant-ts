import Credential from "../../util/Credential";
import TravelPlan from "../map/TravelPlan";
import TravelPlanBuilder from "../map/TravelPlanBuilder";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TRAVEL");

class CastleEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async enter() {
        const request = this.#credential.asRequest();
        request.set("mode", "CASTLE_ENTRY");
        await PocketNetwork.post("map.cgi", request);
        logger.info("进入了城堡。");
    }

    async leave(): Promise<TravelPlan> {
        const request = this.#credential.asRequest();
        request.set("navi", "on");
        request.set("out", "1");
        request.set("mode", "MAP_MOVE");
        const response = await PocketNetwork.post("map.cgi", request);
        logger.info("已经离开了城堡。");
        const plan = TravelPlanBuilder.initializeTravelPlan(response.html);
        plan.credential = this.#credential;
        return plan;
    }

}

export = CastleEntrance;