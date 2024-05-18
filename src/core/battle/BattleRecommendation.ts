import SetupLoader from "../../setup/SetupLoader";
import BattlePage from "./BattlePage";

class BattleRecommendation {

    static async analysis(battleCount: number, battlePage: BattlePage): Promise<string> {
        const recommendation = _analysis(battleCount, battlePage);
        return await (() => {
            return new Promise<string>(resolve => resolve(recommendation));
        })();
    }
}

function _analysis(battleCount: number, battlePage: BattlePage): string {
    if (battleCount % 100 === 0) {
        // 每100战强制修理
        return "修";
    }
    if (battlePage.lowestEndure! < SetupLoader.getRepairMinLimitation()) {
        // 有装备耐久度低于阈值了，强制修理
        return "修";
    }

    if (battlePage.battleResult === "战败") {
        // 战败，转到住宿
        return "宿";
    }
    if (battlePage.zodiacBattle! && battlePage.battleResult === "平手") {
        // 十二宫战斗平手，视为战败，转到住宿
        return "宿";
    }

    if (battlePage.zodiacBattle! || battlePage.treasureBattle!) {
        // 十二宫战胜或者秘宝战胜，转到存钱
        return "存";
    }
    let depositBattleCount = SetupLoader.getDepositBattleCount();
    if (depositBattleCount > 0 && battleCount % depositBattleCount === 0) {
        // 设置的存钱战数到了
        return "存";
    }

    // 生命力低于最大值的配置比例，住宿推荐
    if (SetupLoader.getLodgeHealthLostRatio() > 0 &&
        (battlePage.roleHealth! <= battlePage.roleMaxHealth! * SetupLoader.getLodgeHealthLostRatio())) {
        return "宿";
    }
    // 如果MANA小于50%并且小于配置点数，住宿推荐
    if (SetupLoader.getLodgeManaLostPoint() > 0 &&
        (battlePage.roleMana! <= battlePage.roleMaxMana! * 0.5 && battlePage.roleMana! <= SetupLoader.getLodgeManaLostPoint())) {
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

export = BattleRecommendation;