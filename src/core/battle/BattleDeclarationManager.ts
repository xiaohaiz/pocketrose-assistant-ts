import RandomUtils from "../../util/RandomUtils";

class BattleDeclarationManager {

    static randomWinDeclaration(): string {
        return RandomUtils.randomElement(WIN_DECLARATIONS)!;
    }
}

const WIN_DECLARATIONS: string[] = [
    "暴虎冯河",
    "犁庭扫闾",
    "封狼居胥",
    "勒石燕然"
];

export = BattleDeclarationManager;