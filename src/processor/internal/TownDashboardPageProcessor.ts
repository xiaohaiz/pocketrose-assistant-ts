import BattleButtonManager from "../../core/battle/BattleButtonManager";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import SetupLoader from "../../core/config/SetupLoader";
import ExtensionShortcutLoader from "../../core/dashboard/ExtensionShortcutLoader";
import TownDashboardLayoutManager from "../../core/dashboard/TownDashboardLayoutManager";
import TownDashboardPage from "../../core/dashboard/TownDashboardPage";
import TownDashboardPageParser from "../../core/dashboard/TownDashboardPageParser";
import PalaceTaskManager from "../../core/task/PalaceTaskManager";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

const LAYOUT_MANAGER = new TownDashboardLayoutManager();

class TownDashboardPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062,
            10132];
    }

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        await this.#internalProcess(credential);
    }

    async #internalProcess(credential: Credential) {
        const configId = TownDashboardLayoutManager.loadDashboardLayoutConfigId(credential);
        const layout = LAYOUT_MANAGER.getLayout(configId);
        const parser = new TownDashboardPageParser(credential, PageUtils.currentPageHtml(), layout?.battleMode());
        const page = parser.parse();

        $("center:first")
            .attr("id", "systemAnnouncement")
            .each((idx, center) => {
                const id = $(center).attr("id")!;
                // 手机战斗返回后不在页面顶端，尝试自动触顶。
                PageUtils.scrollIntoView(id);
                $(center).after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
                // @ts-ignore
                $("#version").html(__VERSION__);
            });

        $("div:last")
            .append($("" +
                "<p style='display:none' id='eden-1'></p>" +
                "<p style='display:none' id='eden-2'></p>" +
                "<p style='display:none' id='eden-3'></p>" +
                "<p style='display:none' id='eden-4'></p>" +
                "<p style='display:none' id='eden-5'></p>"));

        doMarkElement();
        doRenderMobilization(page);
        doRenderMenu(credential, page);
        doRenderEventBoard(page);
        doRenderRoleStatus(credential, page);
        doRenderEnlargeMode();
        await new BattleButtonManager().createSafeBattleButton();

        if (layout) {
            await layout.render(credential, page);
        }
    }

}

function doMarkElement() {
    const t0 = $("table:first");
    $(t0).find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .attr("id", "online_list");

    $("input:text:last").attr("id", "messageInputText");
    $("input:submit[value='更新']").attr("id", "refreshButton");
    $("table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .attr("id", "mobilization")
        .parent()
        .parent()
        .find("> tr:eq(1)")
        .find("> td:first")
        .attr("id", "leftPanel")
        .next()
        .attr("id", "rightPanel")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .attr("id", "menuTable")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .attr("id", "messageNotification")
        .parent()
        .next()
        .next()
        .find("> td:first")
        .attr("id", "battleCell")
        .next()
        .find("> input:submit:first")
        .attr("id", "battleButton")
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .attr("id", "townCell")
        .next()
        .find("> input:submit:first")
        .attr("id", "townButton")
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .attr("id", "personalCell")
        .next()
        .find("> input:submit:first")
        .attr("id", "personalButton")
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .attr("id", "countryNormalCell")
        .next()
        .find("> input:submit:first")
        .attr("id", "countryNormalButton")
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .attr("id", "countryAdvancedCell")
        .next()
        .find("> input:submit:first")
        .attr("id", "countryAdvancedButton")
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .find("> form:first")
        .find("> input:submit:first")
        .attr("id", "leaveButton")
        .parent()
        .parent()
        .parent()
        .next()
        .find("> td:first")
        .find("> form:first")
        .find("> input:submit:first")
        .attr("id", "exitButton");
}

function doRenderMobilization(page: TownDashboardPage) {
    $("#mobilization")
        .find("> form:first")
        .find("> font:first")
        .text(page.processedMobilizationText!);
}

function doRenderMenu(credential: Credential, page: TownDashboardPage) {
    // ------------------------------------------------------------------------
    // 渲染菜单表格中的所有按钮
    // height & width => 100%
    // Use ASCII text (setup)
    // ------------------------------------------------------------------------
    $("#refreshButton")
        .css("height", "100%")
        .css("width", "100%")
        .css("min-height", "30px")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "RELOAD" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });

    $("#battleButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "BATTLE" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });
    $("#townButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });
    $("#personalButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });
    $("#countryNormalButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });
    $("#countryAdvancedButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });
    $("#leaveButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        })
        .parent()
        .parent()
        .attr("colspan", 1)
        .prev()
        .attr("colspan", 3);
    $("#exitButton")
        .css("height", "100%")
        .css("width", "100%")
        .val((idx, value) => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : value;
        })
        .each((idx, button) => {
            const sId = SetupLoader.getTownDashboardMainButton();
            if (sId !== 0) {
                $(button).addClass("button-" + sId);
            }
        });

    // ------------------------------------------------------------------------
    // 如果开启了祭奠状态的提醒
    // ------------------------------------------------------------------------
    if (SetupLoader.isConsecrateStateRecognizeEnabled(credential.id) && page.role!.canConsecrate!) {
        $("#messageNotification")
            .parent()
            .next()
            .find("> th:first")
            .css("color", "red")
            .css("font-size", "120%");
    }

    // ------------------------------------------------------------------------
    // 如果启用了配置则开始渲染快捷按钮
    // ------------------------------------------------------------------------
    const bsId = SetupLoader.getTownDashboardShortcutButton();
    if (bsId >= 0) {
        const buttonClass = "button-" + bsId;
        $("#menuTable")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> th:first")
            .each((idx, th) => {
                const extensionId = SetupLoader.getTownDashboardExtensionShortcutButton();
                $(th).html("");
                if (extensionId > 0) {
                    const es = ExtensionShortcutLoader.getExtensionShortcut(extensionId)!;
                    const bt = "&nbsp;" + es[0] + "&nbsp;"
                    $(th).css("vertical-align", "bottom")
                        .html("<button role='button' class='" + buttonClass + "' id='shortcut0' " +
                            "style='margin-bottom:8px;white-space:nowrap;width:100%'>" + bt + "</button>")
                    if (es[0] === "养精蓄锐") {
                        $("#eden-1").html(PageUtils.generateFullRecoveryForm(credential));
                        $("#shortcut0").on("click", () => {
                            $("#fullRecovery").trigger("click");
                        });
                    } else {
                        _bindShortcutButton("shortcut0", es[1]);
                    }
                }
            })
            .parent()
            .next()
            .find("> th:first")
            .each((idx, th) => {
                const shortcut1Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;图鉴&nbsp;" : "图鉴(g)";
                const shortcut5Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;个人&nbsp;" : "个人(i)";
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut1' style='white-space:nowrap;width:100%'>" + shortcut1Value + "</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut5' style='white-space:nowrap;width:100%'>" + shortcut5Value + "</button>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $(th).html(html);
                _bindShortcutButton("shortcut1", "PETMAP");
                _bindShortcutButton("shortcut5", "RANK_REMAKE");
            })
            .parent()
            .next()
            .find("> th:first")
            .each((idx, th) => {
                const shortcut2Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;装备&nbsp;" : "装备(e)";
                const shortcut6Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;团队&nbsp;" : "团队(t)";
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut2' style='white-space:nowrap;width:100%'>" + shortcut2Value + "</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut6' style='white-space:nowrap;width:100%'>" + shortcut6Value + "</button>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $(th).html(html);
                _bindShortcutButton("shortcut2", "USE_ITEM");
                _bindShortcutButton("shortcut6", "BATTLE_MES");
            })
            .parent()
            .next()
            .find("> th:first")
            .each((idx, th) => {
                const shortcut3Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;宠物&nbsp;" : "宠物(u)";
                const shortcut7Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;银行&nbsp;" : "银行(b)";
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut3' style='white-space:nowrap;width:100%'>" + shortcut3Value + "</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut7' style='white-space:nowrap;width:100%'>" + shortcut7Value + "</button>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $(th).html(html);
                _bindShortcutButton("shortcut3", "PETSTATUS");
                _bindShortcutButton("shortcut7", "BANK");
            })
            .parent()
            .next()
            .find("> th:first")
            .each((idx, th) => {
                const shortcut4Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;职业&nbsp;" : "职业(z)";
                const shortcut8Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;设置&nbsp;" : "设置(x)";
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut4' style='white-space:nowrap;width:100%'>" + shortcut4Value + "</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut8' style='white-space:nowrap;width:100%'>" + shortcut8Value + "</button>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $(th).html(html);
                _bindShortcutButton("shortcut4", "CHANGE_OCCUPATION");
                _bindShortcutButton("shortcut8", "LETTER");
            });
    }

    // ------------------------------------------------------------------------
    // 增加皇宫任务的通知栏
    // sephirothy: 增加入手信息栏
    // ------------------------------------------------------------------------
    $("#messageNotification")
        .parent()
        .before("" +
            "<tr style='display:none'>" +
            "<td colspan='4' " +
            "id='harvestInfo' " +
            "style='background-color:#F8F0E0;text-align:center;font-weight:bold'></td>" +
            "</tr>" +
            "");

    // ------------------------------------------------------------------------
    // 增加皇宫任务的通知栏
    // ------------------------------------------------------------------------
    $("#messageNotification")
        .parent()
        .after("" +
            "<tr style='display:none'>" +
            "<td colspan='4' " +
            "id='palaceTask' " +
            "style='background-color:#F8F0E0;text-align:center;font-weight:bold'></td>" +
            "</tr>" +
            "");
    new PalaceTaskManager(credential)
        .monsterTaskHtml()
        .then(monsterTask => {
            if (monsterTask !== "") {
                $("#palaceTask").html(monsterTask).parent().show();
            }
        })

    // ------------------------------------------------------------------------
    // 根据配置决定是否隐藏出城和退出按钮
    // ------------------------------------------------------------------------
    if (SetupLoader.isHiddenLeaveAndExitEnabled()) {
        $("#leaveButton")
            .closest("tr")
            .hide()
            .next()
            .hide();
    }

    // ------------------------------------------------------------------------
    // 渲染菜单项
    // ------------------------------------------------------------------------
    $("select[name='level']").html(page.processedBattleLevelSelectionHtml!);

    $("option[value='INN']").text("客栈·驿站");
    $("option[value='LETTER']").text("口袋助手设置");
    $("option[value='RANK_REMAKE']").text("个人面板");
    $("option[value='BATTLE_MES']").text("团队面板");

    $("option[value='USE_ITEM']").text("装备管理");
    $("option[value='ITEM_SEND']").remove();

    $("option[value='PETSTATUS']").text("宠物管理");
    $("option[value='PET_SEND']").remove();
    $("option[value='PETBORN']").remove();

    $("option[value='CHANGE_OCCUPATION']").text("职业管理");
    $("option[value='MAGIC']").remove();

    $("option[value='ARM_SHOP']").text("武器商店");
    $("option[value='PRO_SHOP']").text("防具商店");
    $("option[value='ACC_SHOP']").text("饰品商店");
    $("option[value='ITEM_SHOP']").text("物品商店");

    $("option[value='BAOSHI_SHOP']").text("宝石镶嵌");
    $("option[value='BAOSHI_DELSHOP']").remove();

    $("option[value='PETPROFILE']").text("宠物排行榜");
    $("option[value='CHANGEMAP']").text("冒险家公会");
    $("option[value='CHUJIA']").text("团队管理");

    $("option[value='BANK']").text("口袋银行");
    $("option[value='MONEY_SEND']").remove();
    $("option[value='SALARY']").remove();

    if (SetupLoader.isCollectTownTaxDisabled()) {
        $("option[value='MAKE_TOWN']").remove();
    }
    $("option[value='COU_MAKE']").text("使用手册");
    $("option[value='TENNIS']").text("任务指南");
    $("option[value='DIANMING']").text("统计报告");
}

function doRenderEventBoard(page: TownDashboardPage) {
    $("td:contains('最近发生的事件')")
        .filter(function () {
            return $(this).text() === "最近发生的事件";
        })
        .parent()
        .next()
        .find("td:first")
        .attr("id", "eventBoard")
        .html(page.processedEventBoardHtml!);
}

function doRenderRoleStatus(credential: Credential, page: TownDashboardPage) {
    // ------------------------------------------
    // 练装备相关的展示
    // ------------------------------------------
    if (LocalSettingManager.isWeaponExperienceMax(credential.id)) {
        $("#personalCell").css("background-color", "#FFC0C0");
    }
    if (LocalSettingManager.isArmorExperienceMax(credential.id)) {
        $("#countryNormalCell").css("background-color", "lightgreen");
    }
    if (LocalSettingManager.isAccessoryExperienceMax(credential.id)) {
        $("#countryAdvancedCell").css("background-color", "lightblue");
    }

    // 如果满级并且没有关闭转职入口，则战斗标签红底显示
    if (page.careerTransferNotification) {
        $("#battleCell").css("background-color", "red");
    }
    // 如果没有满级但是有单项能力到达极限，战斗标签黄底显示
    if (page.capacityLimitationNotification) {
        $("#battleCell").css("background-color", "yellow");
    }

    $("#rightPanel")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> th:first")
        .find("> font:first")
        .html((idx, html) => {
            const name = StringUtils.substringBefore(html, "(");
            const unit = StringUtils.substringBetween(html, "(", "军)");
            if (unit.includes("无所属")) {
                return name + "&nbsp;&nbsp;&nbsp;<span id='role_battle_count'>" + page.role!.battleCount + "</span>战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;<span id='role_battle_count'>" + page.role!.battleCount + "</span>战";
            }
        })
        .parent()
        .parent()
        .next()
        .find("> th:first")
        .attr("id", "role_health")
        .parent()
        .find("> th:last")
        .attr("id", "role_mana")
        .parent()
        .next()
        .find("> th:first")
        .attr("id", "role_cash")
        .html(page.cashHtml)
        .next()
        .next()
        .attr("id", "role_experience")
        .html(page.experienceHtml)
        .parent()
        .next()
        .find("> th:first")
        .html(page.rankHtml);

    if (SetupLoader.isHideCountryInformationEnabled()) {
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .next()
            .next()
            .next()
            .next().hide()
            .next().hide()
            .next().hide()
            .next().hide();
    }
}

function doRenderEnlargeMode() {
    const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
    if (enlargeRatio > 0) {
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

        const clock = $("input:text[name='clock']");
        if (clock.length > 0) {
            clock.css("font-size", fontSize + "%");
        }
    }
}

function _bindShortcutButton(buttonId: string, option: string) {
    $("#" + buttonId).on("click", () => {
        $("option[value='" + option + "']")
            .prop("selected", true)
            .closest("td")
            .next()
            .find("> input:submit:first")
            .trigger("click");
    });
}

export = TownDashboardPageProcessor;