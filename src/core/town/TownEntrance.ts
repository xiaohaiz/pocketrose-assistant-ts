import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TimeoutUtils from "../../util/TimeoutUtils";
import TravelPlan from "../map/TravelPlan";
import TravelPlanBuilder from "../map/TravelPlanBuilder";
import TownLoader from "./TownLoader";

class TownEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async enter(townId: string): Promise<void> {
        const action = (credential: Credential, townId: string) => {
            return new Promise<void>(resolve => {
                MessageBoard.publishMessage("等待进城冷却中......(约55秒)");
                TimeoutUtils.execute(55000, function () {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["townid"] = townId;
                    // @ts-ignore
                    request["mode"] = "MOVE";
                    NetworkUtils.sendPostRequest("status.cgi", request, function (html) {
                        if ($(html).text().includes("进入方法选择")) {
                            MessageBoard.publishMessage("与门卫交涉中......");
                            const request = credential.asRequest();
                            // @ts-ignore
                            request["townid"] = townId;
                            // @ts-ignore
                            request["givemoney"] = "1";
                            // @ts-ignore
                            request["mode"] = "MOVE";
                            NetworkUtils.sendPostRequest("status.cgi", request, function () {
                                MessageBoard.publishMessage("门卫通情达理的收取了入城费用放你入城。");
                                const town = TownLoader.load(townId);
                                MessageBoard.publishMessage("进入了<span style='color:greenyellow'>" + town!.name + "</span>。");
                                resolve();
                            });
                        } else {
                            const town = TownLoader.load(townId);
                            MessageBoard.publishMessage("进入了<span style='color:greenyellow'>" + town!.name + "</span>。");
                            resolve();
                        }
                    });
                });
            });
        };
        return await action(this.#credential, townId);
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