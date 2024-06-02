import PageUtils from "../../util/PageUtils";
import {MetroDashboardPageProcessor} from "./MetroDashboardPageProcessor";
import _ from "lodash";
import {SevenHeartTaskManager} from "./SevenHeartTaskManager";
import {PocketLogger} from "../../pocket/PocketLogger";
import Credential from "../../util/Credential";

const logger = PocketLogger.getLogger("METRO");

class MetroDashboardButtonProcessor {

    private readonly credential: Credential;
    private readonly pageProcessor: MetroDashboardPageProcessor;
    private readonly taskManager: SevenHeartTaskManager;

    constructor(credential: Credential,
                pageProcessor: MetroDashboardPageProcessor,
                taskManager: SevenHeartTaskManager) {
        this.credential = credential;
        this.pageProcessor = pageProcessor;
        this.taskManager = taskManager;
    }

    generateHTML() {
        return "";
    }

    bindButtons() {
    }

    async disableButtons() {
        PageUtils.disableElement("returnButton");
        PageUtils.disableElement("task2Button");
        PageUtils.disableElement("task3Button");
        PageUtils.disableElement("task8Button");
    }

    async renderButtons() {
        await this.disableButtons();

        if (this.pageProcessor.nextActionEpochMillis === undefined) {
            await this.restoreButtons();
            return;
        }
        const clock = $("#timeoutClock");
        const cs = clock.text();
        if (cs === "N/A") {
            // 还没有初始化，1秒后再来
            setTimeout(async () => {
                await this.renderButtons();
            }, 1000);
        } else {
            const remain = _.parseInt(cs);
            if (remain <= 0) {
                // 读秒结束了，恢复按钮
                await this.restoreButtons();
                return;
            }
            if (remain > 2) {
                // 剩余时间还长，多休息一会
                const timeoutInMillis = (remain - 2) * 1000;
                setTimeout(async () => {
                    await this.renderButtons();
                }, timeoutInMillis);
            } else {
                setTimeout(async () => {
                    await this.renderButtons();
                }, 200);
            }
        }
    }

    private async restoreButtons() {
        PageUtils.enableElement("returnButton");
        const task = await this.taskManager.loadSevenHeartTask();
        if (!task.task2 && task.task1) PageUtils.enableElement("task2Button");
        if (!task.task3 && task.task2) PageUtils.enableElement("task3Button");
        if (!task.task8 && task.task7) PageUtils.enableElement("task8Button");
    }

    async postMetroDashboardRendered() {
        const taskProgress = await this.taskManager.taskProgress();
        logger.debug("Current seven heart task progress: " + taskProgress);
    }
}

export {MetroDashboardButtonProcessor};