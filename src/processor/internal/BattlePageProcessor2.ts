import _ from "lodash";
import BattlePage from "../../pocketrose/BattlePage";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class BattlePageProcessor2 extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        if (context === undefined) {
            // context is required for battle processing
            return;
        }

        // 给所有的表格加上id，便于后续解析的定位
        $("table").each((idx, table) => {
            const tableId = "t" + idx;
            if ($(table).attr("id") === undefined) {
                $(table).attr("id", tableId);
            }
        });

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
    $("#t0")
        .find("tr:first")
        .after($(html));
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

    page.roleName = $("#t2")
        .find("tr:first")
        .next()
        .next()
        .find("td:eq(1)").text();

    $("#t5")
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

export = BattlePageProcessor2;