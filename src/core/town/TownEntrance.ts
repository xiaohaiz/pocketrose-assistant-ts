import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import OperationMessage from "../../util/OperationMessage";
import TimeoutUtils from "../../util/TimeoutUtils";
import SetupLoader from "../../setup/SetupLoader";
import TravelPlan from "../map/TravelPlan";
import TravelPlanBuilder from "../map/TravelPlanBuilder";
import TownLoader from "./TownLoader";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TRAVEL");

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
                    const request = credential.asRequest()
                    request.set("townid", townId);
                    request.set("mode", "MOVE");
                    PocketNetwork.post("status.cgi", request).then(response => {
                        const html = response.html;
                        if ($(html).text().includes("进入方法选择")) {
                            MessageBoard.publishMessage("与门卫交涉中......");
                            const request = credential.asRequest();
                            request.set("townid", townId);
                            request.set("givemoney", "1");
                            request.set("mode", "MOVE");
                            PocketNetwork.post("status.cgi", request).then(() => {
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
                const request = credential.asRequest()
                request.set("navi", "on");
                request.set("out", "1");
                request.set("mode", "MAP_MOVE");
                PocketNetwork.post("map.cgi", request).then(response => {
                    const html = response.html;
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
        const request = this.#credential.asRequest();
        request.set("town", townId);
        request.set("mode", "ACCESS_POINT");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const success = _.includes(response.html, "据点成功转移到");
        const message = new OperationMessage();
        message.success = success;
        if (success) {
            const townName = TownLoader.load(townId)?.name ?? "";
            logger.debug("Changed access point to [" + townName + "] successfully.");
        }
        return message;
    }
}

export = TownEntrance;