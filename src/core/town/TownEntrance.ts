import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import OperationMessage from "../../util/OperationMessage";
import TimeoutUtils from "../../util/TimeoutUtils";
import SetupLoader from "../config/SetupLoader";
import TravelPlan from "../map/TravelPlan";
import TravelPlanBuilder from "../map/TravelPlanBuilder";
import TownLoader from "./TownLoader";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";

class TownEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async enter(townId: string): Promise<void> {
        const instance = this;
        const action = (credential: Credential, townId: string) => {
            return new Promise<void>(resolve => {
                MessageBoard.publishMessage("等待进城冷却中......(约52秒)");
                TimeoutUtils.execute(52000, function () {
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
                                instance.#changeAccessPointIfNecessary(townId).then(() => {
                                    instance.#changeBattleFieldIfNecessary(credential).then(() => resolve());
                                });
                            });
                        } else {
                            const town = TownLoader.load(townId);
                            MessageBoard.publishMessage("进入了<span style='color:greenyellow'>" + town!.name + "</span>。");
                            instance.#changeAccessPointIfNecessary(townId).then(() => {
                                instance.#changeBattleFieldIfNecessary(credential).then(() => resolve());
                            });
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

    async #changeAccessPointIfNecessary(townId: string) {
        if (!SetupLoader.isAutoChangePointToTown()) return;
        const town = TownLoader.load(townId);
        const message = await this.changeAccessPoint(townId);
        if (message.success && town !== null) {
            MessageBoard.publishMessage("成功转移据点到【" + town.name + "】。");
        }
    }

    async #changeBattleFieldIfNecessary(credential: Credential) {
        await new BattleFieldTrigger(credential).triggerUpdate();
    }

    /**
     * 转移据点到指定的城市。
     * @param townId 城市ID
     */
    async changeAccessPoint(townId: string): Promise<OperationMessage> {
        const request = this.#credential.asRequestMap();
        request.set("town", townId);
        request.set("mode", "ACCESS_POINT");
        const response = await NetworkUtils.post("mydata.cgi", request);
        const success = _.includes(response, "据点成功转移到");
        const message = new OperationMessage();
        message.success = success;
        return message;
    }
}

export = TownEntrance;