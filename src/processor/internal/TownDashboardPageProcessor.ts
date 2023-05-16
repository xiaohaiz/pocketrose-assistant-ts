import EventHandler from "../../core/EventHandler";
import TownDashboard from "../../pocketrose/TownDashboard";
import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import SetupLoader from "../../setup/SetupLoader";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownDashboardPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [7, 8, 16, 24];
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownDashboard.parsePage(PageUtils.currentPageHtml());

        // 手机战斗返回后不在页面顶端，尝试自动触顶。
        $("center:first").attr("id", "systemAnnouncement");
        PageUtils.scrollIntoView("systemAnnouncement");

        // --------------------------------------------------------------------
        // 标记页面上的元素
        // --------------------------------------------------------------------

        // 所有表格加id属性
        $("table").each((idx, table) => {
            const tableId = "t" + idx;
            $(table).attr("id", tableId);
        });
        $("input:text:last").attr("id", "messageInputText");
        $("input:submit[value='更新']").attr("id", "refreshButton");

        $("th:contains('训练·战斗')")
            .filter((idx, th) => {
                return $(th).text() === "训练·战斗";
            })
            .next()
            .attr("id", "battleCell")
            .next()
            .find("input:submit:first")
            .attr("id", "battleButton");

        doProcess(credential, page);
    }

}

function doProcess(credential: Credential, page: TownDashboardPage) {
    let buttonChanged = false;
    if (SetupLoader.isConsecrateStateRecognizeEnabled(credential.id)) {
        buttonChanged = true;
        if (PageUtils.currentPageHtml().includes("可以进行下次祭奠了")) {
            $("#refreshButton").addClass("button-7");
            $("input:submit[value='行动']").addClass("button-7");
        } else {
            $("#refreshButton").addClass("button-8");
            $("input:submit[value='行动']").addClass("button-8");
        }
    }

    $("#refreshButton").attr("height", "100%");
    $("input:submit[value='行动']").attr("height", "100%");

    const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
    if (enlargeRatio > 0) {
        if (!buttonChanged) {
            $("#refreshButton").addClass("button-16");
            $("input:submit[value='行动']").addClass("button-16");
        }

        let fontSize = 100 * enlargeRatio;
        let picWidth = 80 * enlargeRatio;
        let picHeight = 40 * enlargeRatio;

        $("#battleCell")
            .removeAttr("height")
            .find("select:first")
            .css("font-size", fontSize + "%")
            .parent()
            .find("img:first")
            .attr("width", picWidth)
            .attr("height", picHeight)
            .before($("<br>"));
        $("#battleButton")
            .css("height", "100%");
    }


    doRenderBattleMenu(credential);
    doRenderPostHouseMenu();
    doRenderSetupMenu();
    doRenderEquipmentManagementMenu();
    doRenderPetManagementMenu();
    doRenderCareerManagementMenu();
    doRenderAdventureGuildMenu();
    doRenderSuperMarketMenu();
    doRenderGemHouseMenu();
    doRenderPetRankMenu();
    doRenderFastLoginMenu();
    doRenderBankMenu();

    doRenderBattleCount(page);
    doRenderCareerTransferWarning(credential, page);
    doRenderRoleStatus(page);
    doRenderTownTax(credential, page);
    doRenderLeaveTown();
    doRenderEventBoard();

    if (SetupLoader.isTownDashboardShortcutButtonEnabled()) {
        $("th:contains('训练·战斗')")
            .filter((idx, th) => {
                return $(th).text() === "训练·战斗";
            })
            .closest("table")
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
            .attr("colspan", 3)
            .css("text-align", "right")
            .text("训练战斗")
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .text("城市设施")
            .before($("<td><button role='button' class='button-24' id='shortcut1'>鉴</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td><button role='button' class='button-24' id='shortcut2'>装</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td><button role='button' class='button-24' id='shortcut3'>宠</button></td>"))
            .parent()
            .next()
            .find("th:first")
            .css("text-align", "right")
            .before($("<td><button role='button' class='button-24' id='shortcut4'>职</button></td>"))
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


    if (SetupLoader.isMobileMiniDashboardEnabled()) {
        // 手机版极简主页。。尝试简化
        $("center:first").remove();
        $("br:first").remove();
        $("#t0")
            .find("tr:first")
            .remove();

        $("#t1")
            .find("tr:first")
            .remove();
        $("#t2")
            .parent()
            .next()
            .removeAttr("width")
            .css("width", "100%")
            .prev()
            .remove();

        $("#t6")
            .find("tr:first")
            .next()
            .next()
            .next()
            .next().hide()
            .next().hide()
            .next().hide()
            .next().hide();

        $("#t8")
            .find("tr:first")
            .remove();

        $("#t8")
            .find("tr:first")
            .next()
            .find("td:first")
            .attr("colspan", 2)
            .removeAttr("width")
            .css("width", "100%")
            .next()
            .remove();
    }
}

function doRenderBattleMenu(credential: Credential) {
    const preference = SetupLoader.getBattlePlacePreference(credential.id);
    let count = 0;
    // @ts-ignore
    if (preference["primary"]) {
        count++;
    }
    // @ts-ignore
    if (preference["junior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["senior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["zodiac"]) {
        count++;
    }
    if (count === 0) {
        // 没有设置战斗场所偏好，忽略
        return;
    }

    // 设置了战斗场所偏好
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("秘宝之岛")) {
            // do nothing, keep
        } else if (text.startsWith("初级之森")) {
            // do nothing, keep
        } else if (text.startsWith("中级之塔")) {
            // do nothing, keep
        } else if (text.startsWith("上级之洞")) {
            // do nothing, keep
        } else if (text.startsWith("十二神殿")) {
            // do nothing, keep
        } else if (text.startsWith("------")) {
            // do nothing, keep
        } else {
            $(option).remove();
        }
    });
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("初级之森")) {
            // @ts-ignore
            if (!preference["primary"]) {
                $(option).remove();
            }
        } else if (text.startsWith("中级之塔")) {
            // @ts-ignore
            if (!preference["junior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("上级之洞")) {
            // @ts-ignore
            if (!preference["senior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("十二神殿")) {
            // @ts-ignore
            if (!preference["zodiac"]) {
                $(option).remove();
            }
        }
    });
    // 删除连续的分隔线
    let delimMatch = false;
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("------")) {
            if (!delimMatch) {
                delimMatch = true;
            } else {
                $(option).remove();
            }
        } else {
            delimMatch = false;
        }
    });
    // 删除头尾的分隔线
    if ($("select[name='level']").find("option:last").text().startsWith("------")) {
        $("select[name='level']").find("option:last").remove();
    }
    if ($("select[name='level']").find("option:first").text().startsWith("------")) {
        $("select[name='level']").find("option:first").remove();
    }

    if (count === 1) {
        // 只设置了一处战斗场所偏好
        let formBattle = $("form[action='battle.cgi']");
        let selectBattle = formBattle.find('select[name="level"]');
        let btnBattle = formBattle.parent().next().find('input');
        let inputDigits = '';
        $(document).off('keydown.city').on('keydown.city', function (e) {
            if ($("#messageInputText:focus").length > 0) {
                // 当前的焦点在消息框，禁用按键辅助
                return;
            }
            const key = e.key;
            if (key !== undefined && !isNaN(parseInt(key))) {
                inputDigits += key;
            }
            if (inputDigits.length === 2) {
                switch (inputDigits) {
                    case '11':
                        selectBattle.find('option').eq(0).prop('selected', true);
                        break;
                    case '22':
                        selectBattle.find('option').eq(1).prop('selected', true);
                        break;
                    default:
                        inputDigits = '';
                        break;
                }
                btnBattle.trigger("focus")
                // 重置 inputDigits
                inputDigits = '';
            }
        });
    }


}

function doRenderPostHouseMenu() {
    $("option[value='INN']")
        .css("background-color", "yellow")
        .text("客栈·驿站");
}

function doRenderSetupMenu() {
    $("option[value='LETTER']")
        .css("background-color", "yellow")
        .text("口袋助手设置");
}

function doRenderEquipmentManagementMenu() {
    if (SetupLoader.isEquipmentManagementUIEnabled()) {
        $("option[value='USE_ITEM']")
            .css("background-color", "yellow")
            .text("装备管理");
        $("option[value='ITEM_SEND']").remove();
    }
}

function doRenderPetManagementMenu() {
    if (SetupLoader.isPetManagementUIEnabled()) {
        $("option[value='PETSTATUS']")
            .css("background-color", "yellow")
            .text("宠物管理");
        $("option[value='PET_SEND']").remove();
    }
}

function doRenderCareerManagementMenu() {
    if (SetupLoader.isCareerManagementUIEnabled()) {
        $("option[value='CHANGE_OCCUPATION']")
            .css("background-color", "yellow")
            .text("职业管理");
        $("option[value='MAGIC']").remove();
    }
}

function doRenderSuperMarketMenu() {
    if (SetupLoader.isPocketSuperMarketEnabled()) {
        $("option[value='ARM_SHOP']")
            .css("background-color", "yellow");
        $("option[value='PRO_SHOP']")
            .css("background-color", "yellow");
        $("option[value='ACC_SHOP']")
            .css("background-color", "yellow");
        $("option[value='ITEM_SHOP']")
            .css("background-color", "yellow");
    }
}

function doRenderGemHouseMenu() {
    if (SetupLoader.isGemHouseUIEnabled()) {
        $("option[value='BAOSHI_SHOP']")
            .css("background-color", "yellow")
            .text("宝石屋");
        $("option[value='BAOSHI_DELSHOP']")
            .remove();
    }
}

function doRenderPetRankMenu() {
    $("option[value='PETPROFILE']")
        .css("background-color", "yellow")
        .text("宠物排行榜");
}

function doRenderAdventureGuildMenu() {
    $("option[value='CHANGEMAP']")
        .css("background-color", "yellow")
        .text("冒险家公会");
}

function doRenderFastLoginMenu() {
    if (SetupLoader.isFastLoginEnabled()) {
        $("option[value='CHUJIA']")
            .css("background-color", "yellow")
            .text("快速登陆设置");
    }
}

function doRenderBankMenu() {
    if (SetupLoader.isPocketBankEnabled()) {
        $("option[value='BANK']")
            .css("background-color", "yellow")
            .text("口袋银行");
        $("option[value='MONEY_SEND']").remove();
    }
}

function doRenderBattleCount(page: TownDashboardPage) {
    $("td:contains('贡献度')")
        .filter(function () {
            return $(this).text() === "贡献度";
        })
        .closest("table")
        .find("th:first")
        .find("font:first")
        .html(function (_idx, text) {
            const name = StringUtils.substringBefore(text, "(");
            const unit = StringUtils.substringBetween(text, "(", "军)");
            if (unit.includes("无所属")) {
                return name + "&nbsp;&nbsp;&nbsp;" + page.role!.battleCount + "战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;" + page.role!.battleCount + "战";
            }
        });
}

function doRenderCareerTransferWarning(credential: Credential, page: TownDashboardPage) {
    // 如果满级并且没有关闭转职入口，则战斗前标签用红色显示
    if (page.role!.level === 150) {
        if (!SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
            $("#battleCell").css("background-color", "red");
        }
    }
}

function doRenderRoleStatus(page: TownDashboardPage) {
    if (page.role!.level !== 150 && (page.role!.attack === 375 || page.role!.defense === 375
        || page.role!.specialAttack === 375 || page.role!.specialDefense === 375 || page.role!.speed === 375)) {
        $("#battleCell").css("background-color", "yellow");
    }

    $("td:parent").each(function (_idx, td) {
        const text = $(td).text();
        if (text === "经验值") {
            if (SetupLoader.isExperienceProgressBarEnabled()) {
                if (page.role!.level === 150) {
                    $(td).next()
                        .attr("style", "color: blue")
                        .text("MAX");
                } else {
                    const ratio = page.role!.level! / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    const exp = $(td).next().text();
                    $(td).next()
                        .html("<span title='" + exp + "'>" + progressBar + "</span>");
                }
            }
        }
        if (text === "资金") {
            const cashText = $(td).next().text();
            const cash = cashText.substring(0, cashText.indexOf(" Gold"));
            if (parseInt(cash) >= 1000000) {
                $(td).next().css("color", "red");
            }
        }
    });
}

function doRenderTownTax(credential: Credential, page: TownDashboardPage) {
    let td: JQuery | null = null;
    const town = page.role!.town!;
    if (town.name === "枫丹") {
        td = $("th:contains('收益')")
            .filter(function () {
                return $(this).text() === "收益";
            })
            .next()
            .removeAttr("align")
            .css("text-align", "right")
            .html("<span style='color:red' title='枫丹的收益不需要关心'>PRIVACY</span>");
    }
    if (SetupLoader.isCollectTownTaxDisabled()) {
        $("option[value='MAKE_TOWN']").remove();
        return;
    }
    if (page.role!.country !== "在野" && page.role!.country === page.townCountry) {
        if (td === null) {
            td = $("th:contains('收益')")
                .filter(function () {
                    return $(this).text() === "收益";
                })
                .next();
        }
        const tax = parseInt(td!.text());
        if (tax >= 50000) {
            if (tax - Math.floor(tax / 50000) * 50000 <= 10000) {
                td!.css("color", "white")
                    .css("background-color", "green")
                    .css("font-weight", "bold")
                    .attr("id", "tax_" + page.townId);
                doBindTownTaxButton(credential, "tax_" + page.townId);
            }
        }
    }
}

function doRenderLeaveTown() {
    if (!SetupLoader.isHiddenLeaveAndExitEnabled()) {
        return;
    }
    $("th:contains('出城')")
        .filter(function () {
            return $(this).text() === "出城";
        })
        .parent()
        .attr("id", "leaveTownRow")
        .hide()
        .next()
        .attr("id", "safeExitRow")
        .hide();

    $("img:first").attr("id", "townImage");
    $("#townImage").on("click", function () {
        $("#leaveTownRow").toggle();
        $("#safeExitRow").toggle();
    });
}

function doRenderEventBoard() {
    $("td:contains('最近发生的事件')")
        .filter(function () {
            return $(this).text() === "最近发生的事件";
        })
        .parent()
        .next()
        .find("td:first")
        .attr("id", "eventBoard");

    const eventHtmlList: string[] = [];
    $("#eventBoard").html()
        .split("<br>")
        .filter(it => it.endsWith(")"))
        .map(function (it) {
            // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
            const header = "<font color=\"navy\">●</font>";
            return StringUtils.substringAfter(it, header);
        })
        .map(function (it) {
            return EventHandler.handleWithEventHtml(it);
        })
        .forEach(it => eventHtmlList.push(it));

    let html = "";
    html += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
    html += "<tbody>";
    eventHtmlList.forEach(it => {
        html += "<tr>";
        html += "<th style='color:navy;vertical-align:top'>●</th>";
        html += "<td style='width:100%'>";
        html += it;
        html += "</td>";
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    $("#eventBoard").html(html);
}

function doBindTownTaxButton(credential: Credential, cellId: string) {
    $("#" + cellId).on("dblclick", function () {
        const townId = StringUtils.substringAfterLast($(this).attr("id") as string, "_");
        const request = credential.asRequest();
        // @ts-ignore
        request.town = townId;
        // @ts-ignore
        request.mode = "MAKE_TOWN";
        NetworkUtils.sendPostRequest("country.cgi", request, function () {
            $("#refreshButton").trigger("click");
        });
    });
}

export = TownDashboardPageProcessor;