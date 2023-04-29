import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";
import TravelPlan from "./TravelPlan";
import TravelPlanBuilder from "./TravelPlanBuilder";

class CastleEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async enter(): Promise<void> {
        const action = (credential: Credential) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "CASTLE_ENTRY";
                NetworkUtils.sendPostRequest("map.cgi", request, function () {
                    MessageBoard.publishMessage("进入了城堡。");
                    resolve();
                });
            });
        };
        return await action(this.#credential);
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
                NetworkUtils.sendPostRequest("map.cgi", request, function (html) {
                    MessageBoard.publishMessage("已经离开了城堡。");
                    const plan = TravelPlanBuilder.initializeTravelPlan(html);
                    plan.credential = credential;
                    resolve(plan);
                });
            });
        };
        return await action(this.#credential);
    }

}

export = CastleEntrance;