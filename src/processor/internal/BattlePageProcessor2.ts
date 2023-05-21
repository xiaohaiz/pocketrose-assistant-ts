import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import NpcLoader from "../../core/NpcLoader";
import BattlePage from "../../pocketrose/BattlePage";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class BattlePageProcessor2 extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [90];
    }

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

    // 准备新的按钮
    $("table:eq(5)")
        .find("td:first")
        .find("center:first")
        .find("h1:first")
        .next()
        .append($("" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='returnButton'>返回城市</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='depositButton'>返回银行</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='repairButton'>返回修理</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='lodgeButton'>返回住宿</button></div>" +
            ""));

    // 根据设置是否变成大按钮
    if (SetupLoader.isBattleLargeButtonEnabled()) {
        $("#returnButton").addClass("button-90");
        $("#depositButton").addClass("button-90");
        $("#repairButton").addClass("button-90");
        $("#lodgeButton").addClass("button-90");
    }

    // 根据设置的内容修改按钮的台词
    let buttonText = SetupLoader.getBattleReturnButtonText();
    if (buttonText !== "") {
        $("#returnButton").text(_.escape(buttonText));
    }
    buttonText = SetupLoader.getBattleLodgeButtonText();
    if (buttonText !== "") {
        $("#lodgeButton").text(_.escape(buttonText));
    }
    buttonText = SetupLoader.getBattleRepairButtonText();
    if (buttonText !== "") {
        $("#repairButton").text(_.escape(buttonText));
    }
    buttonText = SetupLoader.getBattleDepositButtonText();
    if (buttonText !== "") {
        $("#depositButton").text(_.escape(buttonText));
    }

    // 重新定义按钮的行为
    $("#returnButton").on("click", () => {
        doBeforeReturn(credential, page, context).then(() => {
            $("#returnTown").trigger("click");
        });
    });
    $("#depositButton").on("click", () => {
        doBeforeReturn(credential, page, context).then(() => {
            $("#deposit").trigger("click");
        });
    });
    $("#repairButton").on("click", () => {
        doBeforeReturn(credential, page, context).then(() => {
            $("#repair").trigger("click");
        });
    });
    $("#lodgeButton").on("click", () => {
        doBeforeReturn(credential, page, context).then(() => {
            $("#lodge").trigger("click");
        });
    });

    // 根据返回方式推荐，设置相关按钮的tab优先级
    const recommendation = doRecommendation(page, context);
    switch (recommendation) {
        case "修":
            $("#repairButton").attr("tabindex", 1);
            break;
        case "宿":
            $("#lodgeButton").attr("tabindex", 1);
            break;
        case "存":
            $("#depositButton").attr("tabindex", 1);
            break;
        case "回":
            $("#returnButton").attr("tabindex", 1);
            break;
    }

    // 入手情况的渲染
    renderHarvestMessage(page);

    // 如果强制推荐启用，则删除其余所有的按钮
    if (SetupLoader.isBattleForceRecommendationEnabled()) {
        $("button").each((idx, button) => {
            const tabindex = $(button).attr("tabindex");
            if (tabindex !== "1") {
                $(button).parent().remove();
            } else {
                $(button).trigger("focus");
            }
        });
    }

    // 战斗页自动触底开启
    if (SetupLoader.isBattleResultAutoScrollEnabled()) {
        const buttonId = $("button[tabindex='1']").attr("id")!;
        PageUtils.scrollIntoView(buttonId);
    }

    // 是否使用极简战斗界面
    renderMinimalBattle();
}

function renderHarvestMessage(page: BattlePage) {
    if (page.harvestList!.length === 0) {
        const prompt = SetupLoader.getNormalBattlePrompt();
        if (prompt["person"] !== undefined && prompt["person"] !== "NONE") {
            let person = prompt["person"];
            let imageHtml: string;
            if (person === "SELF") {
                imageHtml = PageUtils.findFirstRoleImageHtml()!;
            } else if (person === "RANDOM") {
                imageHtml = NpcLoader.randomPlayerImageHtml()!;
            } else {
                imageHtml = NpcLoader.getNpcImageHtml(person)!;
            }
            CommentBoard.createCommentBoard(imageHtml);
            $("#commentBoard")
                .css("text-align", "center")
                .css("background-color", "black")
                .css("color", "greenyellow");
            CommentBoard.writeMessage(_.escape(prompt["text"]));
        }
    } else {
        const prompt = SetupLoader.getBattleHarvestPrompt();
        if (prompt["person"] !== undefined && prompt["person"] !== "NONE") {
            let person = prompt["person"];
            let imageHtml: string;
            if (person === "SELF") {
                imageHtml = PageUtils.findFirstRoleImageHtml()!;
            } else if (person === "RANDOM") {
                imageHtml = NpcLoader.randomPlayerImageHtml()!;
            } else {
                imageHtml = NpcLoader.getNpcImageHtml(person)!;
            }
            CommentBoard.createCommentBoard(imageHtml);
            $("#commentBoard").css("text-align", "center");
            for (const it of page.harvestList!) {
                CommentBoard.writeMessage("<b style='font-size:150%'>" + it + "</b><br>");
            }
            CommentBoard.writeMessage(_.escape(prompt["text"]));
        }
    }
}

function doRecommendation(page: BattlePage, context: PageProcessorContext): string {
    const battleCount = parseBattleCount(context);
    if (battleCount % 100 === 0) {
        // 每100战强制修理
        return "修";
    }
    if (page.lowestEndure! < SetupLoader.getRepairMinLimitation()) {
        // 有装备耐久度低于阈值了，强制修理
        return "修";
    }

    if (page.battleResult === "战败") {
        // 战败，转到住宿
        return "宿";
    }
    if (page.zodiacBattle! && page.battleResult === "平手") {
        // 十二宫战斗平手，视为战败，转到住宿
        return "宿";
    }

    if (page.zodiacBattle! || page.treasureBattle!) {
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
        (page.roleHealth! <= page.roleMaxHealth! * SetupLoader.getLodgeHealthLostRatio())) {
        return "宿";
    }
    // 如果MANA小于50%并且小于配置点数，住宿推荐
    if (SetupLoader.getLodgeManaLostPoint() > 0 &&
        (page.roleMana! <= page.roleMaxMana! * 0.5 && page.roleMana! <= SetupLoader.getLodgeManaLostPoint())) {
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

function parseBattleCount(context: PageProcessorContext) {
    const s = context.get("battleCount")!;
    return _.parseInt(s) + 1;
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
                    page.roleHealth = _.parseInt(s);
                    s = StringUtils.substringAfter($(td).text(), " / ");
                    page.roleMaxHealth = _.parseInt(s);
                })
                .next()
                .each((i, td) => {
                    let s = StringUtils.substringBefore($(td).text(), " / ");
                    page.roleMana = _.parseInt(s);
                    s = StringUtils.substringAfter($(td).text(), " / ");
                    page.roleMaxMana = _.parseInt(s);
                })

            monsterTable
                .find("tr:first")
                .next()
                .next()
                .find("td:eq(1)")
                .each((i, td) => {
                    let s = StringUtils.substringBefore($(td).text(), " / ");
                    page.monsterHealth = _.parseInt(s);
                })
        });


    if (page.roleHealth! === 0) {
        page.battleResult = "战败";
    } else if (page.monsterHealth! === 0) {
        page.battleResult = "战胜";
    } else {
        page.battleResult = "平手";
    }

    page.harvestList = [];
    $("table:eq(5)")
        .find("p")
        .filter((idx, p) => $(p).text().includes("入手！"))
        .each((idx, p) => {
            _.split($(p).html(), "<br>").forEach(it => {
                if (it.endsWith("入手！")) {
                    page.harvestList!.push(it);
                }
            });
        });

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

function renderMinimalBattle() {
    if (!SetupLoader.isMobileMiniDashboardEnabled()) {
        return;
    }
    $("table:first")
        .find("tr:first")
        .next()
        .next()
        .next()
        .next()
        .next()
        .next().hide()
        .next().hide()
        .next().hide()
        .next().hide();

    let lastIndex = -1;
    $("table:eq(5)")
        .find("tbody:first")
        .find("tr:first")
        .find("td:first")
        .find("center:first")
        .find("h1:first").hide()
        .next()
        .find("font:first")
        .find("b:first")
        .attr("id", "battleRecordContainer")
        .find("p")
        .each((idx, p) => {
            const text = $(p).text();
            if (text.startsWith("第") && text.includes("回合")) {
                lastIndex = idx;
            }
        });

    $("#battleRecordContainer")
        .find("p")
        .each((idx, p) => {
            const text = $(p).text();
            if (text.startsWith("第") && text.includes("回合")) {
                if (idx !== lastIndex) {
                    $(p).hide();
                } else {
                    $(p).find("table:eq(1)")
                        .hide();
                }
            }
        });
}

async function doBeforeReturn(credential: Credential, page: BattlePage, context: PageProcessorContext): Promise<void> {
    return await (() => {
        return new Promise<void>(resolve => {
            resolve();
        });
    })();
}

export = BattlePageProcessor2;