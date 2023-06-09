import _ from "lodash";
import RandomUtils from "../../util/RandomUtils";

class BattleDeclarationManager {

    static randomWinDeclaration(monster: string | null | undefined) {
        let foe = monster ? monster : "对手";
        foe = "<span style='color:green'>" + foe + "</span>";
        let t = RandomUtils.randomElement(WIN_DECLARATIONS)!;
        t = _.replace(t, "%MONSTER%", foe);
        return "<span style='color:indigo'>" + t + "</span>";
    }

    static randomLoseDeclaration(monster: string | null | undefined) {
        let foe = monster ? monster : "对手";
        foe = "<span style='color:green'>" + foe + "</span>";
        let t = RandomUtils.randomElement(LOSE_DECLARATIONS)!;
        t = _.replace(t, "%MONSTER%", foe);
        return "<span style='color:indigo'>" + t + "</span>";
    }
}

const WIN_DECLARATIONS: string[] = [
    "暴虎冯河，战胜了%MONSTER%！",
    "犁庭扫闾，战胜了%MONSTER%！",
    "封狼居胥，战胜了%MONSTER%！",
    "勒石燕然，战胜了%MONSTER%！",
    "饮马翰海，战胜了%MONSTER%！"
];

const LOSE_DECLARATIONS: string[] = [
    "涕泗横流，被%MONSTER%暴揍一顿！",
    "如丧考妣，竟然会败给%MONSTER%！",
    "哀毁骨立，%MONSTER%默默的看着你！",
    "捶胸顿足，%MONSTER%你给我等着！",
    "辙乱旗靡，能逃过%MONSTER%的追杀？",
];

export = BattleDeclarationManager;