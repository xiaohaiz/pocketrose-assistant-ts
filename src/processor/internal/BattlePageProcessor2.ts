import _ from "lodash";
import BattlePage from "../../pocketrose/BattlePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class BattlePageProcessor2 extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        if (context === undefined || context.get("battleCount") === undefined) {
            // context is required for battle processing
            return;
        }

        // 解析页面的反馈的数据
        const page = parsePage();

        // 开始正式处理战斗页面
        processBattle(credential, page, context);
    }

}

function processBattle(credential: Credential, page: BattlePage, context: PageProcessorContext) {
    // 删除原来所有的表单
    $("form").remove();

    // 在页面中添加隐藏的表格用于准备自定义的表单
    let html = "";
    html += "<tr style='display:none'>";
    html += "<td id='hidden-1'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='hidden-2'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='hidden-3'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='hidden-4'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='hidden-5'></td>";
    html += "</tr>";
    $("table:first")
        .find("tr:first")
        .after($(html));

    // 准备新的表单
    generateReturnForm(credential);
    generateDepositForm(credential);
    generateRepairForm(credential);
    generateLodgeForm(credential);
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

    $("table:eq(5)")
        .find("td:contains('＜怪物＞')")
        .filter((idx, td) => $(td).text() === "＜怪物＞")
        .each((idx, td) => {
            let monsterTable = $(td).closest("table");
            let roleTable = monsterTable.parent().prev().find("table:first");

            roleTable
                .find("tr:first")
                .next()
                .next()
                .find("td:eq(1)")
                .each((i, td) => {
                    let s = StringUtils.substringBefore($(td).text(), " / ");
                    page.roleHealth = parseInt(s);
                })
                .next()
                .each((i, td) => {
                    let s = StringUtils.substringBefore($(td).text(), " / ");
                    page.roleMana = parseInt(s);
                })

            monsterTable
                .find("tr:first")
                .next()
                .next()
                .find("td:eq(1)")
                .each((i, td) => {
                    let s = StringUtils.substringBefore($(td).text(), " / ");
                    page.monsterHealth = parseInt(s);
                })
        });


    if (page.roleHealth! === 0) {
        page.battleResult = "战败";
    } else if (page.monsterHealth! === 0) {
        page.battleResult = "战胜";
    } else {
        page.battleResult = "平手";
    }

    return page;
}

function generateReturnForm(credential: Credential) {
    const form = PageUtils.generateReturnTownForm(credential);
    $("#hidden-1").html(form);
}

function generateDepositForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='azukeru' value='all'>";
    form += "<input type='hidden' name='mode' value='BANK_SELL'>";
    form += "<input type='submit' id='deposit'>";
    form += "</form>";
    $("#hidden-2").html(form);
}

function generateRepairForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='arm_mode' value='all'>";
    form += "<input type='hidden' name='mode' value='MY_ARM2'>";
    form += "<input type='submit' id='repair'>";
    form += "</form>";
    $("#hidden-3").html(form);
}

function generateLodgeForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='mode' value='RECOVERY'>";
    form += "<input type='submit' id='lodge'>";
    form += "</form>";
    $("#hidden-4").html(form);
}

async function doBeforeReturn(): Promise<void> {
    return await (() => {
        return new Promise<void>(resolve => {
            resolve();
        });
    })();
}

export = BattlePageProcessor2;