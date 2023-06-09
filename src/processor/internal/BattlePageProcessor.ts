import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import BattlePage from "../../core/battle/BattlePage";
import BattleProcessor from "../../core/battle/BattleProcessor";
import BattleReturnInterceptor from "../../core/battle/BattleReturnInterceptor";
import NpcLoader from "../../core/NpcLoader";
import TownDashboardLayoutManager from "../../dashboard/TownDashboardLayoutManager";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class BattlePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        // 解析当前的战数
        const battleCount = parseBattleCount(context);
        if (battleCount === undefined) {
            return;
        }

        // 解析页面的反馈的数据
        const processor = new BattleProcessor(credential, PageUtils.currentPageHtml(), battleCount);
        processor.doProcess();

        // 开始正式处理战斗页面
        processBattle(credential, processor);
    }

}

function processBattle(credential: Credential,
                       processor: BattleProcessor) {
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
            "<div style='display:none' id='delim'></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='returnButton'>返回城市</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='depositButton'>返回银行</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='repairButton'>返回修理</button></div>" +
            "<div style='padding-top:10px;padding-bottom:10px'><button role='button' id='lodgeButton'>返回住宿</button></div>" +
            ""));

    // 根据设置的内容修改按钮的台词
    let buttonText = SetupLoader.getBattleLodgeButtonText();
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
        $("#returnButton").prop("disabled", true);
        new BattleReturnInterceptor(credential, processor.obtainBattleCount)
            .doBeforeReturn()
            .then(() => {
                $("#returnTown").trigger("click");
            });
    });
    $("#depositButton").on("click", () => {
        $("#depositButton").prop("disabled", true);
        new BattleReturnInterceptor(credential, processor.obtainBattleCount)
            .doBeforeReturn()
            .then(() => {
                $("#deposit").trigger("click");
            });
    });
    $("#repairButton").on("click", () => {
        $("#repairButton").prop("disabled", true);
        new BattleReturnInterceptor(credential, processor.obtainBattleCount)
            .doBeforeReturn()
            .then(() => {
                $("#repair").trigger("click");
            });
    });
    $("#lodgeButton").on("click", () => {
        $("#lodgeButton").prop("disabled", true);
        new BattleReturnInterceptor(credential, processor.obtainBattleCount)
            .doBeforeReturn()
            .then(() => {
                $("#lodge").trigger("click");
            });
    });

    // 根据返回方式推荐，设置相关按钮的tab优先级
    const recommendation = processor.obtainRecommendation;
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

    // 检查是否宠物有技能变化
    let petLearnSpell = false;
    $("#delim")
        .prev()
        .find("> b:first")
        .find("> font:first")
        .find("> font[color='red']")
        .each((idx, font) => {
            const ft = $(font).text();
            if (ft.includes("遗忘了技能") || ft.includes("学会了新技能")) {
                petLearnSpell = true;
                $(font).attr("color", "blue");
            }
        });

    // 入手情况的渲染
    renderHarvestMessage(processor.obtainPage);

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
    renderMinimalBattle(credential);

    if (processor.obtainPage.zodiacBattle!) {
        // 十二宫极速战斗模式
        if (SetupLoader.isZodiacFlashBattleEnabled()) {
            $("button[tabindex='1']").trigger("click");
        }
    } else {
        // 普通战斗极速模式
        if (SetupLoader.isNormalFlashBattleEnabled()) {
            if (!petLearnSpell && processor.obtainPage.harvestList!.length === 0) {
                $("button[tabindex='1']").trigger("click");
            }
        }
    }
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

function parseBattleCount(context?: PageProcessorContext): number | undefined {
    if (context === undefined) {
        return undefined;
    }
    const s = context.get("battleCount");
    if (s === undefined) {
        return undefined;
    }
    return _.parseInt(s) + 1;
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

function renderMinimalBattle(credential: Credential) {
    const layout = TownDashboardLayoutManager.loadDashboardLayoutConfigId(credential);
    if (layout === 2 || layout === 3) {
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
}

export = BattlePageProcessor;