import SetupLoader from "../../config/SetupLoader";
import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownDashboardPageProcessor2 extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [16, 10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062];
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        // --------------------------------------------------------------------
        // 解析城市主页面的内容
        // --------------------------------------------------------------------
        const page = TownDashboardPage.parse(PageUtils.currentPageHtml());

        // --------------------------------------------------------------------
        // 标记页面上的元素
        // --------------------------------------------------------------------
        // 手机战斗返回后不在页面顶端，标记顶端系统公告尝试自动触顶。
        $("center:first").attr("id", "systemAnnouncement");
        PageUtils.scrollIntoView("systemAnnouncement");
        // 所有表格加id属性
        $("table").each((idx, table) => {
            const tableId = "t" + idx;
            $(table).attr("id", tableId);
        });
        // 标记聊天输入文本框
        $("input:text:last")
            .attr("id", "messageInputText");
        // 标记更新按钮
        $("input:submit[value='更新']")
            .attr("id", "refreshButton");
        // 标记菜单所有的按钮
        $("#t5")
            .find("form[action='battle.cgi']")
            .parent()
            .attr("id", "battleCell")
            .next()
            .find("input:submit:first")
            .attr("id", "battleButton");
        $("#t5")
            .find("form[action='town.cgi']")
            .parent()
            .attr("id", "townCell")
            .next()
            .find("input:submit:first")
            .attr("id", "townButton");
        $("#t5")
            .find("form[action='mydata.cgi']")
            .next()
            .attr("id", "personalCell")
            .next()
            .find("input:submit:first")
            .attr("id", "personalButton");
        $("#t5")
            .find("form[action='country.cgi']:first")
            .next()
            .attr("id", "country1Cell")
            .next()
            .find("input:submit:first")
            .attr("id", "country1Button");
        $("#t5")
            .find("form[action='country.cgi']:eq(1)")
            .next()
            .attr("id", "country2Cell")
            .next()
            .find("input:submit:first")
            .attr("id", "country2Button");
        $("#t5")
            .find("form[action='map.cgi']")
            .find("input:submit:first")
            .attr("id", "leaveButton")
            .parent()
            .parent()
            .removeAttr("colspan")
            .before($("<td></td>"));
        $("#t5")
            .find("form[action='exit.cgi']")
            .find("input:submit:first")
            .attr("id", "exitButton");

        // --------------------------------------------------------------------
        // 页面标记完成，开始渲染页面
        // --------------------------------------------------------------------
        doRenderButtons();
        doRenderShortcuts();
        doRenderCountryInformation();
    }


}

function doRenderButtons() {
    $("#refreshButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#battleButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#townButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#personalButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#country1Button")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#country2Button")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#leaveButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    $("#exitButton")
        .addClass("button-16")
        .css("width", "100%")
        .css("height", "100%");
    // 根据设置修改按钮文本
    if (SetupLoader.isAsciiTextButtonEnabled()) {
        $("#refreshButton").val("RELOAD");
        $("#battleButton").val("BATTLE");
        $("#townButton").val("ACTION");
        $("#personalButton").val("ACTION");
        $("#country1Button").val("ACTION");
        $("#country2Button").val("ACTION");
        $("#leaveButton").val("ACTION");
        $("#exitButton").val("ACTION");
    }
}

function doRenderShortcuts() {
    const bsId = SetupLoader.getTownDashboardShortcutButton();
    if (bsId >= 0) {
        const buttonClass = "button-" + bsId;
        $("#t5")
            .find("tr:first")
            .find("td:first")
            .attr("colspan", 5)
            .parent()
            .next()
            .find("th:first")
            .attr("colspan", 4)
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .text("训练战斗")
            .before($("<td style='vertical-align:bottom'><button role='button' class='" + buttonClass + "' id='shortcut0'>个人</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .text("城市设施")
            .before($("<td style='vertical-align:bottom'><button role='button' class='" + buttonClass + "' id='shortcut1'>图鉴</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td style='vertical-align:bottom'><button role='button' class='" + buttonClass + "' id='shortcut2'>装备</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td style='vertical-align:bottom'><button role='button' class='" + buttonClass + "' id='shortcut3'>宠物</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td style='vertical-align:bottom'><button role='button' class='" + buttonClass + "' id='shortcut4'>职业</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .attr("colspan", 3)
            .parent()
            .next()
            .find("th:first")
            .attr("colspan", 4)
            .parent()
            .next()
            .find("th:first")
            .attr("colspan", 5)


        $("#shortcut0").on("click", () => {
            $("option[value='RANK_REMAKE']")
                .prop("selected", true)
                .closest("td")
                .next()
                .find("input:submit:first")
                .trigger("click");
        });
        $("#shortcut1").on("click", () => {
            $("option[value='PETMAP']")
                .prop("selected", true)
                .closest("td")
                .next()
                .find("input:submit:first")
                .trigger("click");
        });
        $("#shortcut2").on("click", () => {
            $("option[value='USE_ITEM']")
                .prop("selected", true)
                .closest("td")
                .next()
                .find("input:submit:first")
                .trigger("click");
        });
        $("#shortcut3").on("click", () => {
            $("option[value='PETSTATUS']")
                .prop("selected", true)
                .closest("td")
                .next()
                .find("input:submit:first")
                .trigger("click");
        });
        $("#shortcut4").on("click", () => {
            $("option[value='CHANGE_OCCUPATION']")
                .prop("selected", true)
                .closest("td")
                .next()
                .find("input:submit:first")
                .trigger("click");
        });
    }
}

function doRenderCountryInformation() {
    // 根据设置隐藏城市支配国信息
    if (SetupLoader.isHideCountryInformationEnabled()) {
        $("#t6")
            .find("font:contains('城市的支配国')")
            .filter((idx, font) => $(font).text().startsWith("城市的支配国"))
            .parent()
            .parent().hide()
            .next().hide()
            .next().hide()
            .next().hide();
    }
}

export = TownDashboardPageProcessor2;