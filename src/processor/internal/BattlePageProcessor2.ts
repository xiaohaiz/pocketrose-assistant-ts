import _ from "lodash";
import BattlePage from "../../pocketrose/BattlePage";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class BattlePageProcessor2 extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = parsePage();
    }

}

function parsePage() {
    const page = new BattlePage();

    const battleField = $("table:first")
        .find("tbody:first")
        .find("tr:first")
        .find("td:first")
        .find("font:first")
        .find("b:first")
        .text();
    page.treasureBattle = battleField.includes("秘宝之岛");
    page.primaryBattle = battleField.includes("初级之森");
    page.juniorBattle = battleField.includes("中级之塔");
    page.seniorBattle = battleField.includes("上级之洞窟");
    page.zodiacBattle = battleField.includes("十二神殿");

    const endureList: number[] = [];
    for (const s of _.split($("#ueqtweixin").text(), "\n")) {
        if (_.endsWith(s, "耐久度")) {
            if (!s.includes("大师球") &&
                !s.includes("宗师球") &&
                !s.includes("超力怪兽球") &&
                !s.includes("宠物蛋")) {
                let t = StringUtils.substringBetween(s, "剩余", "耐久度");
                let n = parseInt(t);
                endureList.push(n);
            }
        }
        if (_.endsWith(s, "回)")) {
            let t = StringUtils.substringBetween(s, "(剩余", "回)");
            let n = parseInt(t);
            endureList.push(n);
        }
    }
    if (endureList.length > 0) {
        page.lowestEndure = _.min(endureList);
    }

    return page;
}

export = BattlePageProcessor2;