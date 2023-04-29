import Credential from "../util/Credential";
import TravelPlan from "./TravelPlan";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";
import TravelPlanBuilder from "./TravelPlanBuilder";

class TownEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async leave(): Promise<TravelPlan> {
        const action = (credential: Credential) => {
            return new Promise<TravelPlan>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["navi"] = "on";
                // @ts-ignore
                request["out"] = "1";
                // @ts-ignore
                request["mode"] = "MAP_MOVE";
                NetworkUtils.sendPostRequest("map.cgi", request, function (html: string) {
                    MessageBoard.publishMessage("离开了当前所在城市。");
                    const plan = TravelPlanBuilder.initializeTravelPlan(html);
                    plan.credential = credential;
                    resolve(plan);
                });
            });
        };
        return await action(this.#credential);
    }

}

export = TownEntrance;