import Credential from "../../util/Credential";
import SetupLoader from "../../setup/SetupLoader";
import {DayRange} from "../../util/PocketDateUtils";
import {PocketCache} from "../../pocket/PocketCache";
import {TownPersonalChampion} from "../champion/TownPersonalChampion";
import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import {PocketLogger} from "../../pocket/PocketLogger";
import TeamMemberLoader from "../team/TeamMemberLoader";

const logger = PocketLogger.getLogger("CHAMPION");
const CACHE_ID = "PersonalChampion";

class PersonalChampionTrigger {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async triggerPersonalChampionMatch() {
        if (!SetupLoader.isAutoTriggerPersonalChampionEnabled()) {
            // 没开配置，此项功能不启用，忽略返回
            return;
        }
        const date = new Date();

        if (date.getDay() !== 3) {
            // 今天不是周三，非比赛日，忽略返回
            return;
        }
        const hours = date.getHours();
        if (!(hours >= 13 && hours <= 23)) {
            // 不是比赛时间，忽略返回（1:00PM开始比赛）
            return;
        }
        if (!TeamMemberLoader.isMaster(this.credential.id)) {
            // 只有队长才有权限触发
            return;
        }

        // 检查前置条件完成，开始正式的触发逻辑。

        let doTrigger: boolean = false;
        const status = await this.loadPersonalChampionStatus(date);
        if (status === null) {
            // 还没有个天状态的记录，很可能是当天第一次，触发
            doTrigger = true;
        } else {
            // 根据状态判断是否需要触发
            if (status.nextMatchTime! === 0) {
                // 比赛已经结束了，不再需要触发
                doTrigger = false;
            } else {
                if (date.getTime() >= status.nextMatchTime!) {
                    // 满足触发的时间需求
                    doTrigger = true;
                }
            }
        }

        if (doTrigger) {
            // 触发个天比赛开始并生产状态保存
            await this.triggerPersonalChampionMatchStartup(date);
        }
    }

    private async loadPersonalChampionStatus(date: Date): Promise<PersonalChampionStatus | null> {
        const co = await PocketCache.loadCacheObject(CACHE_ID);
        if (co === null) return null;
        const status = PersonalChampionStatus.newInstance(co.json!);
        const dt = new DayRange(date.getTime()).asText();
        if (status.matchDay !== dt) return null;    // 不是当天的记录，无效返回
        return status;
    }

    private async triggerPersonalChampionMatchStartup(date: Date) {
        const page = await new TownPersonalChampion(this.credential).open();
        const traditional = page.traditionalHTML;

        const status = new PersonalChampionStatus();
        status.createTime = Date.now();
        status.matchDay = new DayRange(date.getTime()).asText();
        if (_.includes(traditional, "※ 抽签完成")) {
            // 第一次触发抽签，下次战斗就可以触发比赛了
            status.nextMatchTime = status.createTime;
            status.description = "抽签";
        } else if (_.includes(traditional, "※ 下次个人天真将在下周三的13时后举行")) {
            // 正常来说，比赛日只有比赛没有开始之前才是这样的字样
            // 比赛开始到结束之后不应该出这个，不管了，1分钟再试试看
            status.nextMatchTime = status.createTime + 60000;
            status.description = "未开赛";
        } else if (_.includes(traditional, "轮空")) {
            // 不应该出现轮空字样了
            status.nextMatchTime = status.createTime;
            status.description = "轮空";
        } else if (_.includes(traditional, "※ 试合完成")) {
            // 触发了比赛，5分钟之后再来
            status.nextMatchTime = status.createTime + 300000;
            status.description = "试合完成";
        } else if (_.includes(traditional, "※ 下次试合还需要等待")) {
            // 比赛冷却中，计算下次时间
            let s = StringUtils.substringAfter(traditional!, "※ 下次试合还需要等待");
            s = StringUtils.substringBefore(s, "秒");
            const seconds = _.parseInt(s);
            status.nextMatchTime = status.createTime + (seconds * 1000);
            status.description = "等待冷却";
        } else if (_.includes(traditional, "※ 本日试合全部结束")) {
            // 本日比赛结束
            status.nextMatchTime = 0;
            status.description = "比赛结束";
        }

        if (status.nextMatchTime !== undefined) {
            if (logger.isDebugEnabled) {
                logger.debug("Personal champion status:");
                logger.debug("  |- matchDay        : " + status.matchDay)
                logger.debug("  |- createTime      : " + new Date(status.createTime!).toLocaleString())
                logger.debug("  |- nextTriggerTime : " + status.nextTriggerTimeText)
                logger.debug("  \\- description     : " + status.description);
            }
            // 将个天状态写入缓存
            await PocketCache.writeCacheObject(CACHE_ID,
                JSON.stringify(status.asDocument()),
                PocketCache.expirationUntilTomorrow());
        }
    }
}

class PersonalChampionStatus {

    createTime?: number;
    matchDay?: string;
    nextMatchTime?: number;
    description?: string;

    get nextTriggerTimeText() {
        if (this.nextMatchTime === undefined || this.nextMatchTime === 0) {
            return "none";
        }
        const d = new Date(this.nextMatchTime);
        return d.toLocaleString();
    }

    asDocument() {
        const document: any = {};
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.matchDay !== undefined) && (document.matchDay = this.matchDay);
        (this.nextMatchTime !== undefined) && (document.nextMatchTime = this.nextMatchTime);
        (this.description !== undefined) && (document.description = this.description);
        return document;
    }

    static newInstance(json: string) {
        const document = JSON.parse(json);
        const status = new PersonalChampionStatus();
        (document.createTime !== undefined) && (status.createTime = document.createTime);
        (document.matchDay !== undefined) && (status.matchDay = document.matchDay);
        (document.nextMatchTime !== undefined) && (status.nextMatchTime = document.nextMatchTime);
        (document.description !== undefined) && (status.description = document.description);
        return status;
    }
}

export {PersonalChampionTrigger};