import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import ExtensionShortcutLoader from "../../core/ExtensionShortcutLoader";
import PalaceTaskManager from "../../core/PalaceTaskManager";
import RankTitleLoader from "../../core/RankTitleLoader";
import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownDashboardPageProcessor2 extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [16, 10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062];
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

        doMarkElement();
        doRenderMobilization();
        doRenderMenu(credential);
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

function doRenderMenu(credential: Credential) {
    // ------------------------------------------------------------------------
    // 渲染菜单表格中的所有按钮
    // height & width => 100%
    // Use ASCII text (setup)
    // ------------------------------------------------------------------------
    $("#refreshButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("RELOAD");
            }
        });
    $("#battleButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("BATTLE");
            }
        });
    $("#townButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
            }
        });
    $("#personalButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
            }
        });
    $("#countryNormalButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
            }
        });
    $("#countryAdvancedButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
            }
        });
    $("#leaveButton")
        .css("height", "100%")
        .css("width", "100%")
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
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
        .addClass("button-16")
        .each((idx, button) => {
            if (SetupLoader.isAsciiTextButtonEnabled()) {
                $(button).val("ACTION");
            }
        });

    // ------------------------------------------------------------------------
    // 如果启用了配置则开始渲染快捷按钮
    // ------------------------------------------------------------------------
    const bsId = SetupLoader.getTownDashboardShortcutButton();
    if (bsId > 0) {
        const buttonClass = "button-" + bsId;
        $("#menuTable")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> th:first")
            .each((idx, th) => {
                const extensionId = SetupLoader.getTownDashboardExtensionShortcutButton();
                if (extensionId > 0) {
                    const es = ExtensionShortcutLoader.getExtensionShortcut(extensionId)!;
                    const bt = "&nbsp;" + es[0] + "&nbsp;"
                    $(th).css("vertical-align", "bottom")
                        .html("<button role='button' class='" + buttonClass + "' id='shortcut0' " +
                            "style='margin-bottom:8px;white-space:nowrap'>" + bt + "</button>")
                    _bindShortcutButton("shortcut0", es[1]);
                } else {
                    $(th).html("");
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
        const monsterTask = new PalaceTaskManager(credential).monsterTaskHtml;
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
}

function _renderBattleMenu(credential: Credential) {
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

export = TownDashboardPageProcessor2;