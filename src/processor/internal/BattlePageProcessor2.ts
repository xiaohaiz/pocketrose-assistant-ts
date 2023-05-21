import BattlePage from "../../pocketrose/BattlePage";
import Credential from "../../util/Credential";
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

    return page;
}

export = BattlePageProcessor2;