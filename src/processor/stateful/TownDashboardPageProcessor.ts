import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import _ from "lodash";
import ButtonUtils from "../../util/ButtonUtils";
import {RoleStatus, RoleStatusManager} from "../../core/role/RoleStatus";
import TownDashboardPageParser from "../../core/dashboard/TownDashboardPageParser";
import PageUtils from "../../util/PageUtils";
import TownDashboardPage from "../../core/dashboard/TownDashboardPage";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import TownDashboardKeyboardManager from "../../core/dashboard/TownDashboardKeyboardManager";
import SetupLoader from "../../core/config/SetupLoader";
import StringUtils from "../../util/StringUtils";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import DashboardPageUtils from "../../core/dashboard/DashboardPageUtils";
import {MiscConfigManager} from "../../core/config/ConfigManager";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import BattleScene from "../../core/battle/BattleScene";
import BattleSceneStorage from "../../core/battle/BattleSceneStorage";
import BattleProcessor from "../../core/battle/BattleProcessor";
import BattleReturnInterceptor from "../../core/battle/BattleReturnInterceptor";
import TownInn from "../../core/inn/TownInn";
import TownBank from "../../core/bank/TownBank";
import TownForge from "../../core/forge/TownForge";
import TownDashboard from "../../core/dashboard/TownDashboard";
import BattleRecordStorage from "../../core/battle/BattleRecordStorage";
import {BattleErrorPageProcessor} from "../../core/battle/BattleErrorPageProcessor";
import {BattleButtonProcessor} from "../../core/battle/BattleButtonProcessor";
import PalaceTaskManager from "../../core/task/PalaceTaskManager";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import {CareerTransferTrigger} from "../../core/trigger/CareerTransferTrigger";
import {BattleWordManager} from "../../core/battle/BattleWordManager";
import MessageBoard from "../../util/MessageBoard";
import {PocketLogger} from "../../pocket/PocketLogger";
import Conversation from "../../core/dashboard/Conversation";
import PocketPageRenderer from "../../util/PocketPageRenderer";

const townLogger = PocketLogger.getLogger("TOWN");
const battleLogger = PocketLogger.getLogger("BATTLE");

class TownDashboardPageProcessor extends StatefulPageProcessor {

    private readonly roleStatusManager: RoleStatusManager;
    private readonly buttonProcessor: BattleButtonProcessor;
    private readonly errorPageProcessor: BattleErrorPageProcessor;
    private readonly palaceTaskManager: PalaceTaskManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.roleStatusManager = new RoleStatusManager(credential);
        this.buttonProcessor = new BattleButtonProcessor(credential);
        this.errorPageProcessor = new BattleErrorPageProcessor(credential);
        this.palaceTaskManager = new PalaceTaskManager(credential);
    }

    private dashboardPage?: TownDashboardPage;

    protected async doProcess(): Promise<void> {
        const buttonStyles = [10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062, 10132];
        _.forEach(buttonStyles, it => ButtonUtils.loadButtonStyle(it));

        const parser = new TownDashboardPageParser(this.credential, PageUtils.currentPageHtml());
        this.dashboardPage = parser.parse();

        await this.initializeDashboard();
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        await this.render();

        new TownDashboardKeyboardManager(
            this.credential,
            this.dashboardPage.battleLevelShortcut,
            this.dashboardPage
        ).bind();
    }

    private async initializeDashboard() {
        // Trigger expired RoleStatus eviction.
        await this.roleStatusManager.load();

        // Update RoleStatus cache if necessary
        const status = new RoleStatus();
        let changeCount = 0;
        if (this.dashboardPage?.role?.name) {
            status.name = this.dashboardPage.role.name;
            changeCount++;
        }
        if (this.dashboardPage!.townId) {
            // 解析城市页面后更新角色当前所在城市的数据
            status.townId = this.dashboardPage!.townId;
            changeCount++;
        }
        const roleLevel = this.context?.get("roleLevel");
        if (roleLevel !== undefined) {
            // 更新角色等级数据
            status.level = _.parseInt(roleLevel);
            changeCount++;
        }
        const roleCareer = this.context?.get("roleCareer");
        if (roleCareer !== undefined) {
            // 更新角色职业数据
            status.career = roleCareer;
            changeCount++;
        }
        if (changeCount > 0) {
            // Update RoleStatus cache object.
            await new RoleStatusManager(this.credential).update(status);
        }

        // RoleStatus update finished, trigger battlefield change.
        await new BattleFieldTrigger(this.credential).triggerUpdate();
    }

    private async generateHTML() {
        $("body:first > center:first")
            .attr("id", "systemAnnouncement");
        if (SetupLoader.isMobileTownDashboardEnabled()) {
            $("#systemAnnouncement").html(() => {
                return "<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"
            });
        } else {
            $("#systemAnnouncement")
                .after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
        }
        $("#version").html(() => {
            // @ts-ignore
            return __VERSION__;
        });

        const t0 = $("body:first > table:first");
        t0.find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "online_list");

        const t1 = t0.find("> tbody:first")
            .find("> tr:eq(1) > td:first > table:first");

        t1.find("> tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "mobilization");

        const leftPanel = t1.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .attr("id", "leftPanel");
        const rightPanel = leftPanel.next()
            .attr("id", "rightPanel");

        rightPanel.find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first")
            .attr("id", "r1");
        rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first")
            .attr("id", "r2");
        rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> table:first")
            .attr("id", "r3");

        if (SetupLoader.isMobileTownDashboardEnabled()) {
            $("#mobilization")
                .html("<span style='background-color:lightgreen;font-weight:bold;font-size:120%' " +
                    "id='watch2'></span><form style='display:none'><input type='text' name='watch'></form>");
            // 这里需要一个隐藏的form:input:text（页面遗留的计时器是找第一个text）
            this._showTime();
        } else {
            $("input[name='watch']")
                .hide()
                .after($("<span style='background-color:lightgreen;font-weight:bold;font-size:120%' " +
                    "id='watch2'></span>"));
            this._showTime();
        }

        await this._generateBattlePanelHTML();
        await this._generateControlPanelHTML();
        await this._generateRoleInformationHTML();
        await this._generateEventBoardHTML();
        await this._generateMessageBoardHTML();
        await this._generateConversationMessageHTML();

        if (SetupLoader.isMobileTownDashboardEnabled()) {
            leftPanel.hide();
            const r1 = $("#r1");
            const r2 = $("#r2");
            const r3 = $("#r3");

            r2.find("> tbody:first > tr:first > th:first")
                .css("font-size", "200%");

            const r2HTML = r2.parent().html();
            const r3HTML = r3.parent().html();

            r2.parent().parent().remove();
            r3.parent().parent().remove();

            r1.parent().parent().before($("" +
                "<tr><td>" + r2HTML + "</td></tr>" +
                "<tr><td>" + r3HTML + "</td></tr>"));

            $("#battleMenu")
                .parent()
                .before($("<tr><td colspan='4'>　</td></tr>"))
                .after($("<tr><td colspan='4'>　</td></tr>"));
            $("#townMenu")
                .parent()
                .after($("<tr><td colspan='4'>　</td></tr>"));
            $("#personalMenu")
                .parent()
                .after($("<tr><td colspan='4'>　</td></tr>"));
            $("#countryNormalMenu")
                .parent()
                .after($("<tr><td colspan='4'>　</td></tr>"));
        } else {
            leftPanel
                .removeAttr("width")
                .css("width", "40%")
                .find("> table:first")
                .removeAttr("width")
                .css("width", "95%");
            rightPanel
                .removeAttr("width")
                .css("width", "60%");
        }

        if (SetupLoader.isMobileTownDashboardEnabled()) {
            const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
            if (enlargeRatio > 0) {
                const fontSize = 100 * enlargeRatio;
                $("#townMenu")
                    .find("select:first")
                    .css("font-size", fontSize + "%");
                $("#personalMenu")
                    .find("select:first")
                    .css("font-size", fontSize + "%");
                $("#countryNormalMenu")
                    .find("select:first")
                    .css("font-size", fontSize + "%");
                $("#countryAdvanceMenu")
                    .find("select:first")
                    .css("font-size", fontSize + "%");
            }
        }
    }

    private async _generateBattlePanelHTML() {
        if (SetupLoader.isMobileTownDashboardEnabled()) {
            const t1 = $("body:first > table:eq(1)");
            t1.find("> tbody:first > tr:first > td:first")
                .css("text-align", "center")
                .attr("id", "battlePanel")
                .html("");
            t1.find("> tbody:first > tr:eq(2) > td:last").hide();
        } else {
            const leftPanel = $("#leftPanel");
            const tbody = leftPanel.find("> table:first > tbody:first");
            tbody.find("> tr:eq(1)").addClass("C_TownInformation");
            tbody.find("> tr:eq(2)").addClass("C_TownInformation");
            tbody.find("> tr:eq(3)").addClass("C_TownInformation");
            if (!this._canCollectTownTax()) {
                tbody.find("> tr:eq(3) > td:first > table:first > tbody:first")
                    .find("> tr:eq(1) > td:first")
                    .css("text-align", "center")
                    .html("-");
            }
            tbody.append($("" +
                "<tr class='C_BattleInformation' style='text-align:center;display:none' id='battlePanel'><td></td></tr>" +
                "<tr class='C_BattleInformation' style='height:100%;display:none'><td></td></tr>"));
        }
    }

    private async _generateControlPanelHTML() {
        const r1 = $("#r1");
        r1.find("> tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "messageNotification");
        r1.find("> tbody:first")
            .find("> tr:eq(1) > th:first")
            .attr("id", "actionNotification")
            .next()
            .find("> form:first")
            .find("> input:submit")
            .attr("id", "reloadSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .attr("id", "battleMenu")
            .next()
            .find("> input:submit")
            .attr("id", "battleSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .attr("id", "townMenu")
            .next()
            .find("> input:submit")
            .attr("id", "townSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(4) > td:first")
            .attr("id", "personalMenu")
            .next()
            .find("> input:submit")
            .attr("id", "personalSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(5) > td:first")
            .attr("id", "countryNormalMenu")
            .next()
            .find("> input:submit")
            .attr("id", "countryNormalSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(6) > td:first")
            .attr("id", "countryAdvanceMenu")
            .next()
            .find("> input:submit")
            .attr("id", "countryAdvanceSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(7) > th:first")
            .attr("colspan", 3)
            .next()
            .attr("colspan", 1)
            .find("> form:first")
            .find("> input:submit")
            .attr("id", "leaveSubmit");
        r1.find("> tbody:first")
            .find("> tr:eq(8) > td:last")
            .find("> form:first")
            .find("> input:submit")
            .attr("id", "exitSubmit");

        let buttonClass = "C_pocket_StatelessElement";
        const sId = SetupLoader.getTownDashboardMainButton();
        if (sId !== 0) buttonClass += " button-" + sId;

        $("#reloadSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='reloadButton'></button>"));
        const reloadButton = $("#reloadButton");
        reloadButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "RELOAD" : "更新";
        });

        $("#battleSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='battleButton'></button>"));
        const battleButton = $("#battleButton");
        battleButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "BATTLE" : "战斗";
        });
        battleButton.hide();    // 战斗按钮默认状态是隐藏的

        $("#townSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='townButton'></button>"));
        const townButton = $("#townButton");
        townButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        $("#personalSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='personalButton'></button>"));
        const personalButton = $("#personalButton");
        personalButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        $("#countryNormalSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='countryNormalButton'></button>"));
        const countryNormalButton = $("#countryNormalButton");
        countryNormalButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        $("#countryAdvanceSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='countryAdvanceButton'></button>"));
        const countryAdvanceButton = $("#countryAdvanceButton");
        countryAdvanceButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        $("#leaveSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='leaveButton'></button>"));
        const leaveButton = $("#leaveButton");
        leaveButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        $("#exitSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='exitButton'></button>"));
        const exitButton = $("#exitButton");
        exitButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });

        if (SetupLoader.isHiddenLeaveAndExitEnabled()) {
            leaveButton.closest("tr").hide();
            exitButton.closest("tr").hide();
        }

        r1.find("> tbody:first > tr:first")
            .after($("" +
                "<tr style='display:none'>" +
                "<td colspan='4' " +
                "id='harvestInfo' " +
                "style='background-color:#F8F0E0;text-align:center;font-weight:bold'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td colspan='4' " +
                "id='palaceTask' " +
                "style='background-color:#F8F0E0;text-align:center;font-weight:bold'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td colspan='4' " +
                "id='validationFailure' " +
                "style='background-color:#D4D4D4;text-align:center'></td>" +
                "</tr>" +
                ""));

        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            let fontSize = 100 * enlargeRatio;
            let picWidth = 80 * enlargeRatio;
            let picHeight = 40 * enlargeRatio;

            $("#battleMenu")
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

        const bsId = SetupLoader.getTownDashboardShortcutButton();
        if (bsId >= 0) {
            const buttonClass = "button-" + bsId;
            $("#battleMenu").closest("tr").find("> th:first").html("");
            $("#townMenu").closest("tr").find("> th:first").html(() => {
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
                return html;
            });
            $("#personalMenu").closest("tr").find("> th:first").html(() => {
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
                return html;
            });
            $("#countryNormalMenu").closest("tr").find("> th:first").html(() => {
                const shortcut3Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;宠物&nbsp;" : "宠物(u)";
                const shortcut7Value = SetupLoader.isShortcutPromptHidden() ? "&nbsp;统计&nbsp;" : "统计(j)";
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
                return html;
            });
            $("#countryAdvanceMenu").closest("tr").find("> th:first").html(() => {
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
                return html;
            });
        }
    }

    private async _generateRoleInformationHTML() {
        const r2 = $("#r2");
        r2.find("> tbody:first > tr:first").addClass("C_RoleInformation");
        r2.find("> tbody:first > tr:eq(1)").addClass("C_RoleInformation");
        r2.find("> tbody:first > tr:eq(2)").addClass("C_RoleInformation");
        r2.find("> tbody:first > tr:eq(3)").addClass("C_RoleInformation");
        r2.find("> tbody:first > tr:eq(4)").addClass("C_CountryInformation");
        r2.find("> tbody:first > tr:eq(5)").addClass("C_CountryInformation");
        r2.find("> tbody:first > tr:eq(6)").addClass("C_CountryInformation");
        r2.find("> tbody:first > tr:eq(7)").addClass("C_CountryInformation");

        r2.find("> tbody:first > tr:first > th:first").html((_idx, s) => {
            const name = StringUtils.substringBefore(s, "(");
            const unit = StringUtils.substringBetween(s, "(", "军)");
            if (unit.includes("无所属")) {
                return name + "&nbsp;&nbsp;&nbsp;<span id='roleBattleCount'>-</span>战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;<span id='roleBattleCount'>-</span>战";
            }
        });
        r2.find("> tbody:first > tr:eq(1)")
            .find("> th:first")
            .attr("id", "roleHealth");
        r2.find("> tbody:first > tr:eq(1)")
            .find("> th:last")
            .attr("id", "roleMana");
        r2.find("> tbody:first > tr:eq(2)")
            .find("> th:first")
            .attr("id", "roleCash");
        r2.find("> tbody:first > tr:eq(2)")
            .find("> th:last")
            .attr("id", "roleExperience");
        r2.find("> tbody:first > tr:eq(3)")
            .find("> th:first")
            .attr("id", "roleRank");
        r2.find("> tbody:first > tr:eq(3)")
            .find("> th:last")
            .attr("id", "roleContribution");

        r2.find("> tbody:first")
            .find("> tr:eq(3)")
            .after($("" +
                "<tr class='C_RoleInformation'>" +
                "<td height='5'>职业</td><th id='roleCareer'>-</th>" +
                "<td>祭奠ＲＰ</td><th id='consecrateRP'>-</th>" +
                "</tr>" +
                "<tr class='C_RoleInformation'>" +
                "<td height='5'>收益</td><th id='townTax' class='C_TownTaxButton'>-</th>" +
                "<td>额外ＲＰ</td><th id='additionalRP'>-</th>" +
                "</tr>"));

        if (SetupLoader.isHideCountryInformationEnabled()) {
            $(".C_CountryInformation").hide();
        }
    }

    private async _generateEventBoardHTML() {
        const r3 = $("#r3");
        r3.find("> tbody:first > tr:eq(1) > td:first")
            .attr("id", "eventBoard");
    }

    private async _generateMessageBoardHTML() {
        const t1 = $("body:first > table:eq(1)");
        t1.find("> tbody:first > tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:eq(1)")
            .attr("id", "messageBoard")
            .removeAttr("align")
            .css("text-align", "left")
            .css("color", "white");
    }

    private async _generateConversationMessageHTML() {
        const t1 = $("body:first > table:eq(1)");
        const td = t1.find("> tbody:first > tr:eq(1) > td:first");

        const messageForm = td.find("> form:first");
        messageForm.find("> input:text:first")
            .attr("id", "messageInputText");

        const tr = t1.find("> tbody:first > tr:eq(2)");
        tr.find("> td:first > table:first")
            .attr("id", "globalMessage");
        tr.find("> td:first > table:eq(1)")
            .attr("id", "personalMessage");
        tr.find("> td:first > table:eq(2)")
            .attr("id", "redPaperMessage");
        tr.find("> td:eq(1) > table:first")
            .attr("id", "domesticMessage");
        tr.find("> td:eq(1) > table:eq(1)")
            .attr("id", "unitMessage");
        tr.find("> td:eq(1) > table:eq(2)")
            .attr("id", "townMessage");

        let buttonClass = "C_pocket_StatelessElement";
        const sId = SetupLoader.getTownDashboardMainButton();
        if (sId !== 0) buttonClass += " button-" + sId;
        const messageButtonLabel = SetupLoader.isAsciiTextButtonEnabled() ? "SEND" : "发送消息";
        const readButtonLabel = SetupLoader.isAsciiTextButtonEnabled() ? "LOAD" : "加载留言";

        messageForm.find("> input:hidden").remove();
        messageForm.find("> input:submit").remove();
        const formHTML = messageForm.html();
        messageForm.remove();

        td.html((_idx, s) => {
            return formHTML +
                "<button role='button' class='" + buttonClass + "' id='messageButton' style='min-height:30px'>" + messageButtonLabel + "</button>" +
                PocketPageRenderer.OR() +
                "<button role='button' class='" + buttonClass + "' id='readButton'  style='min-height:30px'>" + readButtonLabel + "</button>" +
                "<br>" + s;
        });
    }

    private async resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<span style='font-weight:bold;font-size:120%;color:wheat'>" +
            "东风夜放花千树。更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。<br>" +
            "蛾儿雪柳黄金缕。笑语盈盈暗香去。众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。" +
            "</span>");
    }

    private async bindButtons() {
        $("#reloadButton").on("click", async () => {
            PageUtils.disableElement("reloadButton");
            await this.dispose();
            PageUtils.triggerClick("reloadSubmit");
        });
        $("#battleButton").on("click", async () => {
            if (SetupLoader.isTraditionalBattleModeEnabled()) {
                await this.dispose();
                PageUtils.triggerClick("battleSubmit");
            } else {
                await this._onBattleButtonClicked();
                new TownDashboardKeyboardManager(
                    this.credential,
                    this.dashboardPage?.battleLevelShortcut,
                    this.dashboardPage
                ).bind();
            }
        });
        $("#townButton").on("click", async () => {
            PageUtils.disableElement("townButton");
            await this.dispose();
            PageUtils.triggerClick("townSubmit");
        });
        $("#personalButton").on("click", async () => {
            PageUtils.disableElement("personalButton");
            await this.dispose();
            PageUtils.triggerClick("personalSubmit");
        });
        $("#countryNormalButton").on("click", async () => {
            PageUtils.disableElement("countryNormalButton");
            await this.dispose();
            PageUtils.triggerClick("countryNormalSubmit");
        });
        $("#countryAdvanceButton").on("click", async () => {
            PageUtils.disableElement("countryAdvanceButton");
            await this.dispose();
            PageUtils.triggerClick("countryAdvanceSubmit");
        });
        $("#leaveButton").on("click", async () => {
            await this.dispose();
            PageUtils.triggerClick("leaveSubmit");
        });
        $("#exitButton").on("click", async () => {
            await this.dispose();
            PageUtils.triggerClick("exitSubmit");
        });

        const bsId = SetupLoader.getTownDashboardShortcutButton();
        if (bsId >= 0) {
            const mapping = new Map<string, string>();
            mapping.set("shortcut1", "PETMAP");
            mapping.set("shortcut5", "RANK_REMAKE");
            mapping.set("shortcut2", "USE_ITEM");
            mapping.set("shortcut6", "BATTLE_MES");
            mapping.set("shortcut3", "PETSTATUS");
            mapping.set("shortcut7", "DIANMING");
            mapping.set("shortcut4", "CHANGE_OCCUPATION");
            mapping.set("shortcut8", "LETTER");
            mapping.forEach((option, buttonId) => {
                $("#" + buttonId).on("click", () => {
                    $("option[value='" + option + "']")
                        .prop("selected", true)
                        .closest("td")
                        .next()
                        .find("> button:first")
                        .trigger("click");
                });
            });
        }

        const messageInput = $("#messageInputText");
        const messageButton = $("#messageButton");
        messageButton.on("click", async () => {
            messageInput.prop("disabled", true);
            messageButton.prop("disabled", true);
            const target = $("select[name='mes_id']").val() as string;
            const message = _.trim(messageInput.val() as string);
            if (message === "") {
                messageInput.prop("disabled", false);
                messageButton.prop("disabled", false);
                townLogger.warn("不能发送空白消息！");
                return;
            }
            if (message.length > 200) {
                messageInput.prop("disabled", false);
                messageButton.prop("disabled", false);
                townLogger.warn("消息不能超过200字符！");
                return;
            }
            const response = await new TownDashboard(this.credential).sendMessage(target, message);
            if (_.includes(response, "ERROR !")) {
                messageInput.prop("disabled", false);
                messageButton.prop("disabled", false);
                return;
            }
            // 消息发送成功，使用“阅读消息”模式来刷新主页
            await this.renderConversation();
            messageInput.prop("disabled", false);
            messageButton.prop("disabled", false);
            messageInput.val("");
        });

        const readButton = $("#readButton");
        readButton.on("click", async () => {
            readButton.prop("disabled", true);
            await this.renderConversation();
            readButton.prop("disabled", false);
        });
    }

    private async _onBattleButtonClicked() {
        await this.resetMessageBoard();
        battleLogger.debug("Battle button clicked.");

        const reloadButton = $("#reloadButton");
        const battleButton = $("#battleButton");

        reloadButton.hide();
        battleButton.hide();

        const battlePanel = $("#battlePanel");
        const roleStatus = await this.roleStatusManager.load();
        battlePanel.html(() => {
            let html = "";
            if (!SetupLoader.isQuietBattleModeEnabled()) {
                html += roleStatus?.readImageHtml ?? "";
                if (html !== "") html += "<br>";
            }
            html += "<span style='color:navy;font-weight:bold;font-size:200%'>准备战斗</span>";
            return html;
        });
        if ($("#battlePanel:hidden").length > 0) {
            // 当前battlePanel处于隐藏状态
            $(".C_TownInformation").hide();
            $(".C_BattleInformation").show();
        }

        const request = this.credential.asRequestMap();
        const battleForm = $("#battleMenu").find("> form:first");
        battleForm.find("> input:hidden")
            .filter((_idx, input) => $(input).attr("name") !== "id")
            .filter((_idx, input) => $(input).attr("name") !== "pass")
            .each((_idx, input) => {
                const name = $(input).attr("name")!;
                const value = $(input).val()! as string;
                request.set(name, value);
            });
        battleForm.find("> select:first")
            .each((_idx, select) => {
                const value = $(select).val()! as string;
                // noinspection JSDeprecatedSymbols
                request.set("level", escape(value));
            });

        const battleCount = _.parseInt(request.get("ktotal")!);

        battleLogger.debug("Battle count : " + battleCount);

        const html = (await PocketNetwork.post("battle.cgi", request)).html;
        if (_.includes(html, "ERROR !")) {
            await this.errorPageProcessor.processErrorPage(html);
            this.dashboardPage = await new TownDashboard(this.credential).open();
            reloadButton.show();
            await this.renderClock();
            await this.render();
            return;
        }

        battlePanel.html(() => {
            let html = "";
            if (!SetupLoader.isQuietBattleModeEnabled()) {
                html += roleStatus?.readImageHtml ?? "";
                if (html !== "") html += "<br>";
            }
            html += "<span style='color:navy;font-weight:bold;font-size:200%'>" + BattleWordManager.randomBattleWord() + "</span>";
            return html;
        });

        // Write battle scene
        const scene = new BattleScene();
        scene.id = this.credential.id;
        scene.roleId = this.credential.id;
        scene.beforePage = PageUtils.currentPageHtml();
        scene.afterPage = html;
        const r = {};
        request.forEach((v, k) => {
            // @ts-ignore
            r[k] = v;
        });
        scene.request = JSON.stringify(r);
        await BattleSceneStorage.getInstance().upsert(scene);
        battleLogger.debug("Battle scene saved.");

        const processor = new BattleProcessor(this.credential, html, battleCount + 1);
        await processor.doProcess();

        battleLogger.debug("Battle field  : " + processor.obtainPage.battleField);
        battleLogger.debug("Monster name  : " + processor.obtainPage.monsterNameHtml ?? "-");
        battleLogger.debug("Battle result : " + processor.obtainPage.battleResult ?? "-");

        const recommendation = processor.obtainRecommendation;
        battleLogger.debug("Battle result recommendation: " + recommendation);

        const returnInterceptor = new BattleReturnInterceptor(this.credential, battleCount + 1, processor.obtainPage);
        await returnInterceptor.beforeExitBattle();

        switch (recommendation) {
            case "修": {
                this.dashboardPage = await new TownForge(this.credential).repairAll();
                break;
            }
            case "宿": {
                this.dashboardPage = await new TownInn(this.credential).recovery();
                break;
            }
            case "存": {
                this.dashboardPage = await new TownBank(this.credential).depositAll();
                if (processor.obtainPage.zodiacBattle) {
                    this.dashboardPage = await new TownInn(this.credential).recovery();
                }
                break;
            }
            case "回": {
                this.dashboardPage = await new TownDashboard(this.credential).open();
                break;
            }
            default: {
                this.dashboardPage = await new TownDashboard(this.credential).open();
                break;
            }
        }

        reloadButton.show();
        await this.renderClock();
        await this.render();
    }

    private async render() {
        $("#systemAnnouncement").css("background-color", "transparent");
        PageUtils.scrollIntoView("systemAnnouncement");

        $(".C_TownTaxButton").off("click").off("dblclick");

        await this._renderMobilization();
        await this._renderPalaceTask();
        await this._renderValidationFailure();
        await this._renderControlPanel();
        await this._renderEventBoard();
        await this._renderConversationMessage();
        await this._renderBattleOption();
        await this._renderBattleButton();
        await this._renderBattlePanel();
        await this._renderReminderWarnings();
        await this._renderTownTax();

        // --------------------------------------------------------------------
        // Render role information
        // --------------------------------------------------------------------

        $("#roleBattleCount").html(() => {
            return this.dashboardPage?.role?.battleCount?.toLocaleString() ?? "-";
        });
        $("#roleHealth").html(() => {
            const current = this.dashboardPage?.role?.health;
            const max = this.dashboardPage?.role?.maxHealth;
            return current + "/" + max;
        });
        $("#roleMana").html(() => {
            const current = this.dashboardPage?.role?.mana;
            const max = this.dashboardPage?.role?.maxMana;
            return current + "/" + max;
        });
        $("#roleCash").html(() => {
            return this.dashboardPage?.cashHtml ?? "-";
        });
        $("#roleExperience").html(() => {
            return this.dashboardPage?.experienceHtml ?? "-";
        });
        $("#roleRank").html(() => {
            return this.dashboardPage?.rankHtml ?? "-";
        });
        $("#roleContribution").html(() => {
            const contribution = this.dashboardPage?.role?.contribution;
            if (contribution === undefined) return "-";
            return contribution >= 10000 ? "<span style='color:blue'>MAX</span>" : contribution + " p";
        });

        const status = await this.roleStatusManager.load();
        let career = status?.career;
        let consecrateRP = status?.readConsecrateRP;
        let additionalRP = status?.readAdditionalRP;
        if (career === undefined || consecrateRP === undefined || additionalRP === undefined) {
            const role = await new PersonalStatus(this.credential).load();
            career = role.career;
            consecrateRP = role.consecrateRP;
            additionalRP = role.additionalRP;
        }
        $("#roleCareer").html(() => {
            return career ?? "-";
        });
        $("#consecrateRP").html(() => {
            return consecrateRP?.toString() ?? "-";
        });
        $("#additionalRP").html(() => {
            return DashboardPageUtils.generateAdditionalRPHtml(additionalRP);
        });

    }

    private async renderClock() {
        $("#actionNotification").html(this.dashboardPage!.actionNotificationHtml!);
        const clock = $("input:text[name='clock']");
        if (clock.length > 0) {
            const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
            if (enlargeRatio > 0) {
                let fontSize = 100 * enlargeRatio;
                clock.css("font-size", fontSize + "%");
            }
            let timeout = _.parseInt(clock.val() as string);
            if (timeout > 0) {
                const start = Date.now() / 1000;
                this._countDownClock(timeout, start, clock);
            }
        }
    }

    private async renderConversation() {
        const conversationPage = await new Conversation(this.credential).open();
        $("select[name='mes_id']").html(conversationPage.messageTargetSelectHtml!);
        $("#globalMessage").html(conversationPage.globalMessageHtml!);
        $("#personalMessage").html(conversationPage.personalMessageHtml!);
        $("#redPaperMessage").html(conversationPage.redPaperMessageHtml!);
        $("#domesticMessage").html(conversationPage.domesticMessageHtml!);
        $("#unitMessage").html(conversationPage.unitMessageHtml!);
        $("#townMessage").html(conversationPage.townMessageHtml!);
    }

    private async _renderMobilization() {
        $("#mobilization")
            .find("> form:first")
            .find("> font:first")
            .text(this.dashboardPage!.processedMobilizationText!);

        $("#online_list").html(this.dashboardPage!.onlineListHtml!);
    }

    private async _renderPalaceTask() {
        const palaceTask = $("#palaceTask");
        const html = await this.palaceTaskManager.monsterTaskHtml();
        if (html === "") {
            palaceTask.html("").parent().hide();
        } else {
            palaceTask.html(html).parent().show();
        }
    }

    private async _renderValidationFailure() {
    }

    private async _renderControlPanel() {
        $("#battleMenu").find("> form:first > select:first").html(() => {
            return this.dashboardPage!.processedBattleLevelSelectionHtml!;
        });

        $("option[value='INN']").text("口袋驿站");
        $("option[value='ARM_SHOP']").text("武器商店");
        $("option[value='PRO_SHOP']").text("防具商店");
        $("option[value='ACC_SHOP']").text("饰品商店");
        $("option[value='BAOSHI_SHOP']").text("宝石镶嵌");
        $("option[value='BAOSHI_DELSHOP']").remove();
        $("option[value='ITEM_SHOP']").text("物品商店");
        $("option[value='BANK']").text("口袋银行");
        $("option[value='FREE_SELL']").text("城堡管家");
        $("option[value='ITEM_SEND']").remove();
        $("option[value='MONEY_SEND']").remove();
        $("option[value='PET_SEND']").remove();
        $("option[value='PETPROFILE']").text("宠物排行榜");
        $("option[value='TENNIS']").text("任务指南");
        $("option[value='CHANGEMAP']").text("冒险家公会");


        $("option[value='LETTER']").text("口袋助手设置");
        $("option[value='SALARY']").remove();
        $("option[value='DIANMING']").text("统计报告");
        $("option[value='MAGIC']").remove();
        $("option[value='BATTLE_MES']").text("团队面板");
        $("option[value='USE_ITEM']").text("装备管理");
        $("option[value='PETSTATUS']").text("宠物管理");
        $("option[value='PETBORN']").remove();
        $("option[value='CHANGE_OCCUPATION']").text("职业管理");
        $("option[value='RANK_REMAKE']").text("个人面板");
        $("option[value='COU_MAKE']").text("使用手册");
        $("option[value='CHUJIA']").text("团队管理");

        if (!this._canCollectTownTax()) {
            $("option[value='MAKE_TOWN']").remove();
        }
    }

    private async _renderEventBoard() {
        $("#eventBoard").html(() => {
            return this.dashboardPage?.processedEventBoardHtml ?? "";
        });
    }

    private async _renderConversationMessage() {
        $("select[name='mes_id']").html(this.dashboardPage!.messageTargetSelectHtml!);
        $("#globalMessage").html(this.dashboardPage!.globalMessageHtml!);
        $("#personalMessage").html(this.dashboardPage!.personalMessageHtml!);
        $("#redPaperMessage").html(this.dashboardPage!.redPaperMessageHtml!);
        $("#domesticMessage").html(this.dashboardPage!.domesticMessageHtml!);
        $("#unitMessage").html(this.dashboardPage!.unitMessageHtml!);
        $("#townMessage").html(this.dashboardPage!.townMessageHtml!);
    }

    private async _renderBattleOption() {
        $("input:hidden[name='ktotal']").val(this.dashboardPage!.role!.battleCount!);
        $("input:hidden[name='sessionid']").val(this.dashboardPage!.battleSessionId!);

        const battleForm = $("#battleMenu").find("> form:first");
        battleForm.find("> img:first")
            .attr("src", this.dashboardPage!.battleVerificationSource!);
        $("a:contains('看不到图片按这里')")
            .filter((_idx, a) => $(a).text() === '看不到图片按这里')
            .attr("href", this.dashboardPage!.battleVerificationSource!);
        $("#messageNotification")
            .html(this.dashboardPage!.messageNotificationHtml!);
    }

    private async _renderBattleButton() {
        await this.buttonProcessor.renderBattleButton();
    }

    private async _renderBattlePanel() {
        const record = await BattleRecordStorage.load(this.credential.id);
        if (record === null || !record.available) {
            $(".C_TownInformation").show();
            $(".C_BattleInformation").hide();
            $("#battlePanel").html("");
        } else {
            const battlePanel = $("#battlePanel");
            battlePanel.html(() => {
                return "<div style='text-align:center'>" + record.html! + "</div>";
            });
            if (record.petEggHatched! && record.petSpellLearned!) {
                battlePanel.find("> div:first")
                    .css("background-color", "yellow");
            } else if (record.petEggHatched!) {
                battlePanel.find("> div:first")
                    .css("background-color", "skyblue");
            } else if (record.petSpellLearned!) {
                battlePanel.find("> div:first")
                    .css("background-color", "wheat");
            }
            $(".C_TownInformation").hide();
            $(".C_BattleInformation").show();
        }
        if (record !== null && record.hasAdditionalNotification) {
            const additionalNotifications: string[] = [];
            const harvestList = record.harvestList;
            if (harvestList && harvestList.length > 0) {
                for (const ht of harvestList) {
                    additionalNotifications.push("<span style='color:red;font-size:200%'>" + ht + "</span>");
                }
            }
            if (record.petEggHatched) {
                additionalNotifications.push("<span style='color:blue;font-size:200%'>" + "宠物蛋孵化成功！" + "</span>");
            }
            if (record.petSpellLearned) {
                additionalNotifications.push("<span style='color:blue;font-size:200%'>" + "宠物学会了新技能！" + "</span>");
            }
            if (record.validationCodeFailed) {
                additionalNotifications.push("<span style='color:red;font-size:200%'>" + "选择验证码错误！" + "</span>");
            }
            const anHtml = _.join(additionalNotifications, "<br>");
            $("#harvestInfo").html(anHtml).parent().show();
        } else {
            $("#harvestInfo").html("").parent().hide();
        }
    }

    private async _renderReminderWarnings() {
        const battleMenu = $("#battleMenu");
        const townMenu = $("#townMenu");
        const personalMenu = $("#personalMenu");
        const countryNormalMenu = $("#countryNormalMenu");
        const countryAdvancedMenu = $("#countryAdvancedMenu");

        battleMenu.css("background-color", "transparent");
        townMenu.css("background-color", "transparent");
        personalMenu.css("background-color", "transparent");
        countryNormalMenu.css("background-color", "transparent");
        countryAdvancedMenu.css("background-color", "transparent");

        // ------------------------------------------
        // 判断装备或者宠物是否满格了
        // ------------------------------------------
        const fullEquipment = LocalSettingManager.isEquipmentCapacityMax(this.credential.id);
        const fullPet = LocalSettingManager.isPetCapacityMax(this.credential.id);
        if (fullEquipment && fullPet) {
            townMenu.css("background-color", "orange");
        } else if (fullEquipment) {
            townMenu.css("background-color", "yellow");
        } else if (fullPet) {
            townMenu.css("background-color", "red");
        }

        // ------------------------------------------
        // 练装备相关的展示
        // ------------------------------------------
        if (LocalSettingManager.isWeaponExperienceMax(this.credential.id)) {
            personalMenu.css("background-color", "#FFC0C0");
        }
        if (LocalSettingManager.isArmorExperienceMax(this.credential.id)) {
            countryNormalMenu.css("background-color", "lightgreen");
        }
        if (LocalSettingManager.isAccessoryExperienceMax(this.credential.id)) {
            countryAdvancedMenu.css("background-color", "lightblue");
        }

        await new CareerTransferTrigger(this.credential).trigger(() => {
            battleMenu.css("background-color", "red");
        });
        if (this.dashboardPage!.capacityLimitationNotification) {
            battleMenu.css("background-color", "yellow");
        }
    }

    private async _renderTownTax() {
        if (!this._canCollectTownTax()) return;
        const container = $("#townTax");
        container.html(_.toString(this.dashboardPage!.townTax!));

        const tax = this.dashboardPage!.townTax!;
        if (tax >= 50000 && (tax - Math.floor(tax / 50000) * 50000 <= 10000)) {
            container.css("color", "white")
                .css("background-color", "green")
                .css("font-weight", "bold");
            new MouseClickEventBuilder()
                .bind(container, async () => {
                    const request = this.credential.asRequestMap();
                    request.set("town", this.dashboardPage!.townId!)
                    request.set("mode", "MAKE_TOWN");
                    await PocketNetwork.post("country.cgi", request);
                    PageUtils.triggerClick("reloadButton");
                });
        } else {
            container.removeAttr("style");
        }
    }

    private _canCollectTownTax(): boolean {
        return (!new MiscConfigManager(this.credential).isCollectTownTaxDisabled) &&
            (this.dashboardPage!.role!.town!.id !== "12") &&
            (this.dashboardPage!.role!.country !== "在野") &&
            (this.dashboardPage!.role!.country === this.dashboardPage!.townCountry);
    }

    private async dispose() {
    }

    private _showTime() {
        const date = new Date();
        const h = date.getHours(); // 0 - 23
        const m = date.getMinutes(); // 0 - 59
        const s = date.getSeconds(); // 0 - 59
        const hour = _.padStart(h.toString(), 2, "0");
        const minute = _.padStart(m.toString(), 2, "0");
        const second = _.padStart(s.toString(), 2, "0");
        const time = hour + ":" + minute + ":" + second;
        $("#watch2").html("&nbsp;&nbsp;&nbsp;" + time + "&nbsp;&nbsp;&nbsp;");
        setTimeout(() => this._showTime(), 1000);
    }

    private _countDownClock(timeout: number, start: number, clock: JQuery) {
        let now = Date.now() / 1000;
        let x = timeout - (now - start);
        clock.val(_.max([_.ceil(x), 0])!);
        if (x > 0) {
            setTimeout(() => {
                this._countDownClock(timeout, start, clock);
            }, 100);
        } else {
            // @ts-ignore
            document.getElementById("mplayer")?.play();
        }
    }
}

export {TownDashboardPageProcessor};