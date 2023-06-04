import _ from "lodash";
import BattleFieldConfigLoader from "../../config/BattleFieldConfigLoader";
import SetupLoader from "../../config/SetupLoader";
import EventHandler from "../../core/EventHandler";
import ExtensionShortcutLoader from "../../core/ExtensionShortcutLoader";
import PalaceTaskManager2 from "../../core/PalaceTaskManager2";
import RankTitleLoader from "../../core/RankTitleLoader";
import TownDashboardLayoutManager from "../../dashboard/TownDashboardLayoutManager";
import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import TimeoutUtils from "../../util/TimeoutUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

const LAYOUT_MANAGER = new TownDashboardLayoutManager();

class TownDashboardPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062,
            10132];
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownDashboardPage.parse(PageUtils.currentPageHtml());

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
        doRenderMobilization();
        doRenderMenu(credential, page);
        doRenderEventBoard();
        doRenderRoleStatus(credential, page);
        doRenderEnlargeMode();
        doProcessSafeBattleButton();

        const configId = TownDashboardLayoutManager.loadDashboardLayoutConfigId(credential);
        LAYOUT_MANAGER.getLayout(configId)?.render(credential, page);
    }

}

function doMarkElement() {
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

function doRenderMobilization() {
    $("#mobilization")
        .find("> form:first")
        .find("> font:first")
        .each((idx, font) => {
            let c = $(font).text();
            let b = StringUtils.substringAfterLast(c, "(");
            let a = StringUtils.substringBefore(c, "(" + b);
            b = StringUtils.substringBefore(b, ")");
            const ss = _.split(b, " ");
            const b1 = _.replace(ss[0], "部队", "");
            const b2 = SetupLoader.isQiHanTitleEnabled() ? RankTitleLoader.transformTitle(ss[1]) : ss[1];
            const b3 = ss[2];
            const s = a + "(" + b1 + " " + b2 + " " + b3 + ")";
            $(font).text(s);
        });
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
                    let esButton = true;
                    const es = ExtensionShortcutLoader.getExtensionShortcut(extensionId)!;
                    if (es[0] === "城市收益") {
                        esButton = _canCollectTownTax(page);
                    }
                    if (esButton) {
                        const bt = "&nbsp;" + es[0] + "&nbsp;"
                        $(th).css("vertical-align", "bottom")
                            .html("<button role='button' class='" + buttonClass + "' id='shortcut0' " +
                                "style='margin-bottom:8px;white-space:nowrap'>" + bt + "</button>")
                        if (es[0] === "养精蓄锐") {
                            $("#eden-1").html(PageUtils.generateFullRecoveryForm(credential));
                            $("#shortcut0").on("click", () => {
                                $("#fullRecovery").trigger("click");
                            });
                        } else {
                            _bindShortcutButton("shortcut0", es[1]);
                        }
                    }
                }
            })
            .parent()
            .next()
            .find("> th:first")
            .each((idx, th) => {
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut1' style='white-space:nowrap'>&nbsp;图鉴&nbsp;</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut5' style='white-space:nowrap'>&nbsp;个人&nbsp;</button>";
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
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut2' style='white-space:nowrap'>&nbsp;装备&nbsp;</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut6' style='white-space:nowrap'>&nbsp;团队&nbsp;</button>";
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
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut3' style='white-space:nowrap'>&nbsp;宠物&nbsp;</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut7' style='white-space:nowrap'>&nbsp;银行&nbsp;</button>";
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
                let html = "";
                html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut4' style='white-space:nowrap'>&nbsp;职业&nbsp;</button>";
                html += "</td>";
                html += "<td>";
                html += "<button role='button' class='" + buttonClass + "' id='shortcut8' style='white-space:nowrap'>&nbsp;设置&nbsp;</button>";
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
    if (SetupLoader.isNewPalaceTaskEnabled()) {
        const monsterTask = new PalaceTaskManager2(credential).monsterTaskHtml;
        if (monsterTask !== "") {
            $("#palaceTask").html(monsterTask).parent().show();
        }
    }

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
    _renderBattleMenu(credential);
    $("option[value='INN']").text("客栈·驿站");
    $("option[value='LETTER']").text("口袋助手设置");
    $("option[value='RANK_REMAKE']").text("个人面板");
    $("option[value='BATTLE_MES']").text("团队面板");
    if (SetupLoader.isEquipmentManagementUIEnabled()) {
        $("option[value='USE_ITEM']").text("装备管理");
        $("option[value='ITEM_SEND']").remove();
    }
    if (SetupLoader.isPetManagementUIEnabled()) {
        $("option[value='PETSTATUS']").text("宠物管理");
        $("option[value='PET_SEND']").remove();
        $("option[value='PETBORN']").remove();
    }
    if (SetupLoader.isCareerManagementUIEnabled()) {
        $("option[value='CHANGE_OCCUPATION']").text("职业管理");
        $("option[value='MAGIC']").remove();
    }
    if (SetupLoader.isPocketSuperMarketEnabled()) {
        $("option[value='ARM_SHOP']").text("武器商店");
        $("option[value='PRO_SHOP']").text("防具商店");
        $("option[value='ACC_SHOP']").text("饰品商店");
        $("option[value='ITEM_SHOP']").text("物品商店");
    }
    if (SetupLoader.isGemHouseUIEnabled()) {
        $("option[value='BAOSHI_SHOP']").text("宝石镶嵌");
        $("option[value='BAOSHI_DELSHOP']").remove();
    }
    $("option[value='PETPROFILE']").text("宠物排行榜");
    $("option[value='CHANGEMAP']").text("冒险家公会");
    if (SetupLoader.isFastLoginEnabled()) {
        $("option[value='CHUJIA']").text("快速登陆设置");
    }
    if (SetupLoader.isPocketBankEnabled()) {
        $("option[value='BANK']").text("口袋银行");
        $("option[value='MONEY_SEND']").remove();
        $("option[value='SALARY']").remove();
    }
    if (SetupLoader.isCollectTownTaxDisabled()) {
        $("option[value='MAKE_TOWN']").remove();
    }
    $("option[value='COU_MAKE']").text("口袋助手使用手册");
    $("option[value='TENNIS']").text("任务屋");
    $("option[value='DIANMING']").text("团队统计");
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

function doRenderRoleStatus(credential: Credential, page: TownDashboardPage) {
    // 如果满级并且没有关闭转职入口，则战斗标签红底显示
    if (page.role!.level === 150) {
        if (!SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
            $("#battleCell").css("background-color", "red");
        }
    }
    // 如果没有满级但是有单项能力到达极限，战斗标签黄底显示
    if (page.role!.level !== 150 && (page.role!.attack === 375 || page.role!.defense === 375
        || page.role!.specialAttack === 375 || page.role!.specialDefense === 375 || page.role!.speed === 375)) {
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
                return name + "&nbsp;&nbsp;&nbsp;" + page.role!.battleCount + "战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;" + page.role!.battleCount + "战";
            }
        })
        .parent()
        .parent()
        .next()
        .next()
        .find("> th:first")
        .each((idx, th) => {
            const text = $(th).text();
            const cash = _.parseInt(StringUtils.substringBefore(text, " Gold"));
            if (cash >= 1000000) {
                $(th).css("color", "red");
            }
        })
        .next()
        .next()
        .each((idx, th) => {
            if (SetupLoader.isExperienceProgressBarEnabled()) {
                if (page.role!.level === 150) {
                    $(th).attr("style", "color: blue").text("MAX");
                } else {
                    const ratio = page.role!.level! / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    const exp = $(th).text();
                    $(th).html("<span title='" + exp + "'>" + progressBar + "</span>");
                }
            }
        })
        .parent()
        .next()
        .find("> th:first")
        .each((idx, th) => {
            if (SetupLoader.isQiHanTitleEnabled()) {
                let c = $(th).text();
                c = StringUtils.substringAfterLast(c, " ");
                c = RankTitleLoader.transformTitle(c);
                $(th).text(c);
            }
        });

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

function doProcessSafeBattleButton() {
    if (!StorageUtils.getBoolean("_pa_045")) {
        return;
    }
    $("#battleButton").hide();

    const clock = $("input:text[name='clock']");
    if (clock.length === 0) {
        // clock已经消失了，表示读秒已经完成，返回
        $("#battleButton").show();
        return;
    }

    const remain = _.parseInt(clock.val()! as string);
    if (remain > 2) {
        const timeoutInMillis = (remain - 2) * 1000;
        TimeoutUtils.execute(timeoutInMillis, () => {
            _startSafeBattleButtonTimer(clock);
        });
    } else {
        _startSafeBattleButtonTimer(clock);
    }
}

function _startSafeBattleButtonTimer(clock: JQuery) {
    const timer = setInterval(() => {
        const remain = _.parseInt(clock.val()! as string);
        if (remain <= 0) {
            clearInterval(timer);
            $("#battleButton").show();
        }
    }, 200);
}

function _renderBattleMenu(credential: Credential) {
    const preference = new BattleFieldConfigLoader(credential).loadConfig();
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
                $("#battleButton").trigger("focus");
                // 重置 inputDigits
                inputDigits = '';
            }
        });
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

function _canCollectTownTax(page: TownDashboardPage) {
    if (SetupLoader.isCollectTownTaxDisabled()) {
        return false;
    }
    if (page.role!.country !== "在野" && page.role!.country === page.townCountry) {
        const tax = page.townTax!;
        if (tax >= 50000) {
            if (tax - Math.floor(tax / 50000) * 50000 <= 10000) {
                return true;
            }
        }
    }
    return false;
}

export = TownDashboardPageProcessor;