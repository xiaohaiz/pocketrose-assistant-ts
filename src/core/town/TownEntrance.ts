import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import OperationMessage from "../../util/OperationMessage";
import TimeoutUtils from "../../util/TimeoutUtils";
import TravelPlan from "../map/TravelPlan";
import TravelPlanBuilder from "../map/TravelPlanBuilder";
import TownLoader from "./TownLoader";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";
import {MapDashboard} from "../dashboard/MapDashboard";

const logger = PocketLogger.getLogger("TRAVEL");

class TownEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    /**
     * 这个方法必须身处在地图上执行。
     */
    async enter(townId: string) {
        const dashboardPage = await new MapDashboard(this.#credential).open();
        if (dashboardPage === null) {
            logger.warn("当前不处在地图模式！");
            return;
        }
        return new Promise<void>(resolve => {
            TimeoutUtils.executeWithTimeoutSpecified(dashboardPage.timeoutInSeconds,
                async () => {
                    const request = this.#credential.asRequest()
                    request.set("townid", townId);
                    request.set("mode", "MOVE");
                    const response = await PocketNetwork.post("status.cgi", request);
                    if (_.includes(response.html, "进入方法选择")) {
                        logger.info("与门卫交涉中......");
                        const request = this.#credential.asRequest();
                        request.set("townid", townId);
                        request.set("givemoney", "1");
                        request.set("mode", "MOVE");
                        await PocketNetwork.post("status.cgi", request);
                        logger.info("门卫通情达理的收取了入城费用放你入城。");
                    }
                    const town = TownLoader.load(townId)!;
                    logger.info("进入了<span style='color:greenyellow'>" + town.name + "</span>。");
                    await this.#changeAccessPointIfNecessary(townId);
                    await this.#changeBattleFieldIfNecessary(this.#credential);
                    resolve();
                },
                () => {
                    logger.info("等待进城冷却中......(约" + dashboardPage.timeoutInSeconds + "秒)");
                });
        });

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