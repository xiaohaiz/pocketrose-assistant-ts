import SetupLoader from "../config/SetupLoader";
import PalaceTaskManager from "../core/PalaceTaskManager";
import Credential from "../util/Credential";
import BattlePage from "./BattlePage";
import BattleRecord from "./BattleRecord";
import BattleStorageManager from "./BattleStorageManager";

class BattleProcessor {

    readonly #credential: Credential;
    readonly #html: string;
    readonly #battleCount: number;

    page?: BattlePage;
    recommendation?: string;

    constructor(credential: Credential, html: string, battleCount: number) {
        this.#credential = credential;
        this.#html = html;
        this.#battleCount = battleCount;
    }

    get obtainBattleCount(): number {
        return this.#battleCount;
    }

    get obtainPage(): BattlePage {
        return this.page!;
    }

    get obtainRecommendation(): string {
        return this.recommendation!;
    }

    doProcess() {
        // 解析战斗页面
        this.page = BattlePage.parse(this.#html);

        // 确认后续行为
        this.recommendation = this.#doRecommendation();

        // 检查是否完成了皇宫任务
        if (SetupLoader.isNewPalaceTaskEnabled() && this.page.monsterTask!) {
            new PalaceTaskManager(this.#credential).finishMonsterTask();
        }

        // 写入战斗记录到DB
        const record = new BattleRecord();
        record.id = this.#credential.id;
        record.html = this.obtainPage.reportHtml;
        BattleStorageManager.getBattleRecordStorage().write(record).then();
    }

    #doRecommendation(): string {
        if (this.#battleCount % 100 === 0) {
            // 每100战强制修理
            return "修";
        }
        if (this.obtainPage.lowestEndure! < SetupLoader.getRepairMinLimitation()) {
            // 有装备耐久度低于阈值了，强制修理
            return "修";
        }

        if (this.obtainPage.battleResult === "战败") {
            // 战败，转到住宿
            return "宿";
        }
        if (this.obtainPage.zodiacBattle! && this.obtainPage.battleResult === "平手") {
            // 十二宫战斗平手，视为战败，转到住宿
            return "宿";
        }

        if (this.obtainPage.zodiacBattle! || this.obtainPage.treasureBattle!) {
            // 十二宫战胜或者秘宝战胜，转到存钱
            return "存";
        }
        let depositBattleCount = SetupLoader.getDepositBattleCount();
        if (depositBattleCount > 0 && this.#battleCount % depositBattleCount === 0) {
            // 设置的存钱战数到了
            return "存";
        }

        // 生命力低于最大值的配置比例，住宿推荐
        if (SetupLoader.getLodgeHealthLostRatio() > 0 &&
            (this.obtainPage.roleHealth! <= this.obtainPage.roleMaxHealth! * SetupLoader.getLodgeHealthLostRatio())) {
            return "宿";
        }
        // 如果MANA小于50%并且小于配置点数，住宿推荐
        if (SetupLoader.getLodgeManaLostPoint() > 0 &&
            (this.obtainPage.roleMana! <= this.obtainPage.roleMaxMana! * 0.5 && this.obtainPage.roleMana! <= SetupLoader.getLodgeManaLostPoint())) {
            return "宿";
        }

        if (SetupLoader.getDepositBattleCount() > 0) {
            // 设置了定期存钱，但是没有到战数，那么就直接返回吧
            return "回";
        } else {
            // 没有设置定期存钱，那就表示每战都存钱
            return "存";
        }
    }
}

export = BattleProcessor;