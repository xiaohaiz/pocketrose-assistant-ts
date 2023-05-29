import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import ExtensionShortcutLoader from "../../core/ExtensionShortcutLoader";
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
        doRenderMenu();
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

function doRenderMenu() {
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
                    doBindShortcutButton("shortcut0", es[1]);
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
                doBindShortcutButton("shortcut1", "PETMAP");
                doBindShortcutButton("shortcut5", "RANK_REMAKE");
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
                doBindShortcutButton("shortcut2", "USE_ITEM");
                doBindShortcutButton("shortcut6", "BATTLE_MES");
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
                doBindShortcutButton("shortcut3", "PETSTATUS");
                doBindShortcutButton("shortcut7", "BANK");
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
                doBindShortcutButton("shortcut4", "CHANGE_OCCUPATION");
                doBindShortcutButton("shortcut8", "LETTER");
            });
    }
}

function doBindShortcutButton(buttonId: string, option: string) {
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