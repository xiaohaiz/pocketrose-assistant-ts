import RandomUtils from "../../util/RandomUtils";

class BattleWordManager {

    static randomBattleWord(): string {
        return RandomUtils.randomElement(WORDS)!;
    }

}

const WORDS: string[] = [
    "愿将腰下剑<br>直为斩楼兰",
    "捐躯赴国难<br>视死忽如归",
    "黄沙百战穿金甲<br>不破楼兰终不还",
    "宁为百夫长<br>不为一书生",
    "忽使燕然上<br>惟留汉将功",
    "当年万里觅封侯<br>匹马戍梁州",
    "三十功名尘与土<br>八千里路云和月",
    "浊酒一杯家万里<br>燕然未勒归无计"
];

export {BattleWordManager};