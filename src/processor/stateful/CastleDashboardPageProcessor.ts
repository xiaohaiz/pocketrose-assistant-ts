import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import DashboardPageUtils from "../../core/dashboard/DashboardPageUtils";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import SetupLoader from "../../setup/SetupLoader";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {CastleDashboardKeyboardManager} from "../../core/dashboard/CastleDashboardKeyboardManager";
import {CastleDashboardPage, CastleDashboardPageParser} from "../../core/dashboard/CastleDashboardPage";
import {CastleDashboardShortcutManager} from "../../core/dashboard/CastleDashboardShortcutManager";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import {RoleStatusManager} from "../../core/role/RoleStatus";
import CommentBoard from "../../util/CommentBoard";
import NpcLoader from "../../core/role/NpcLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import CastleRanch from "../../core/monster/CastleRanch";
import {CastleDashboard} from "../../core/dashboard/CastleDashboard";
import CastleInformation from "../../core/dashboard/CastleInformation";

class CastleDashboardPageProcessor extends StatefulPageProcessor {

    private readonly roleStatusManager: RoleStatusManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.roleStatusManager = new RoleStatusManager(credential);
    }

    private dashboardPage?: CastleDashboardPage;

    protected async doProcess(): Promise<void> {
        ButtonUtils.loadDefaultButtonStyles();
        this.dashboardPage = await CastleDashboardPageParser.parse(PageUtils.currentPageHtml());

        await this.initializeDashboard();
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        await this.render();

        new CastleDashboardKeyboardManager().doBind();
    }

    private async initializeDashboard() {
        // Trigger expired RoleStatus eviction.
        await this.roleStatusManager.load();

        // No more in the town, unset it.
        await this.roleStatusManager.unsetTown();
    }

    private async generateHTML() {
        // 构建系统公告和版本信息栏目
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
        const version = $("#version");
        version.html(() => {
            // @ts-ignore
            return __VERSION__;
        });

        // 隐藏出售城堡的表单
        const sellSubmit = $("input:submit[value='出售城堡']").attr("id", "sellSubmit");
        sellSubmit.prop("disabled", true).hide();
        sellSubmit.closest("form").hide();

        // 标记在线列表
        const containerTable = $("body:first > table:first")
            .attr("id", "containerTable");
        containerTable.find("> tbody:first > tr:first > td:first")
            .removeAttr("width")
            .attr("id", "onlineList");

        // 在动员令的位置，创建新的时钟
        const mainTable = containerTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first")
            .attr("id", "mainTable");
        const mobilization = mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "mobilization");
        // 时钟创建完成，立刻启动（基于系统时间）
        if (SetupLoader.isMobileTownDashboardEnabled()) {
            mobilization.html(
                "<span style='background-color:lightgreen;font-weight:bold;font-size:120%' " +
                "id='watch2'></span><form style='display:none'><input type='text' name='watch'></form>"
            );
            // 这里需要一个隐藏的form:input:text（页面遗留的计时器是找第一个text）
            this._showTime();
        } else {
            $("input[name='watch']").hide()
                .after(
                    $("<span style='background-color:lightgreen;font-weight:bold;font-size:120%' id='watch2'></span>")
                );
            this._showTime();
        }

        // 左右面板
        let tr = mainTable.find("> tbody:first > tr:eq(2)");
        const leftPanel = tr.find("> td:first").attr("id", "leftPanel");
        const rightPanel = tr.find("> td:eq(1)").attr("id", "rightPanel");

        if (!SetupLoader.isMobileTownDashboardEnabled()) {
            leftPanel.find("> table:first")
                .removeAttr("width")
                .css("width", "95%");
        }

        const r1 = rightPanel.find("> table:first > tbody:first")
            .find("> tr:first")
            .attr("id", "r1");
        const r2 = rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(1)")
            .attr("id", "r2");
        const r3 = rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(2)")
            .attr("id", "r3");
        // 控制台
        const controlPanel = r1.find("> td:first > table:first")
            .attr("id", "controlPanel");
        // 角色信息
        const roleInformation = r2.find("> td:first > table:first")
            .attr("id", "roleInformation");
        // 事件屏
        r3.find("> td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1) > td:first")
            .attr("id", "eventBoard");

        // 处理控制台
        controlPanel.find("> tbody:first > tr:first")
            .find("> td:last > form:first > input:submit:first")
            .attr("id", "reloadSubmit");
        controlPanel.find("> tbody:first > tr:eq(1)")
            .find("> td:last > input:submit:first")
            .attr("id", "castleSubmit");
        controlPanel.find("> tbody:first > tr:eq(2)")
            .find("> td:last > input:submit:first")
            .attr("id", "personalSubmit");
        controlPanel.find("> tbody:first > tr:eq(4)")
            .find("> td:last > input:submit:first")
            .attr("id", "developSubmit");
        controlPanel.find("> tbody:first > tr:eq(5)")
            .find("> td:last > form:first")
            .find("> input:submit:first")
            .attr("id", "leaveSubmit")
            .closest("tr")
            .find("> th:first")
            .attr("colspan", 3)
            .closest("tr")
            .find("> td:last")
            .removeAttr("colspan");
        controlPanel.find("> tbody:first > tr:eq(6)")
            .find("> td:last > form:first")
            .find("> input:submit:first")
            .attr("id", "exitSubmit");

        controlPanel.find("> tbody:first > tr:eq(3)").hide();
        if (SetupLoader.isHiddenLeaveAndExitEnabled()) {
            controlPanel.find("> tbody:first > tr:eq(5)").hide();
            controlPanel.find("> tbody:first > tr:eq(6)").hide();
        }
        controlPanel.find("> tbody:first > tr:eq(7)").hide();

        // 处理角色信息
        roleInformation.find("> tbody:first")
            .find("> tr:eq(1) > th:first")
            .attr("id", "roleHealth")
            .closest("tr")
            .find("> th:eq(1)")
            .attr("id", "roleMana");
        roleInformation.find("> tbody:first")
            .find("> tr:eq(2) > th:first")
            .attr("id", "roleCash")
            .closest("tr")
            .find("> th:eq(1)")
            .attr("id", "roleExperience");
        roleInformation.find("> tbody:first")
            .find("> tr:eq(3) > th:first")
            .attr("id", "roleRank")
            .closest("tr")
            .find("> th:eq(1)")
            .attr("id", "roleContribution");
        roleInformation.find("> tbody:first")
            .find("> tr:eq(3)")
            .after($("<tr>" +
                "<td height='5'>职业</td><th id='roleCareer'>-</th>" +
                "<td>祭奠ＲＰ</td><th id='roleConsecrateRP'>-</th>" +
                "</tr>" +
                "<tr>" +
                "<td height='5'></td><th></th>" +
                "<td>额外ＲＰ</td><th id='roleAdditionalRP'>-</th>" +
                "</tr>"));

        // 构建消息面板
        mainTable.find("> tbody:first > tr:eq(3) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:eq(1)")
            .attr("id", "messageBoard")
            .removeAttr("align")
            .css("color", "white")
            .css("text-align", "left")
            .closest("tr")
            .find("> td:eq(2)")
            .removeAttr("width")
            .css("width", "64")
            .attr("id", "messageBoardManager");

        await this._generateControlPanelHTML();
        await this._generateShortcutHTML();

        CommentBoard.createCommentBoard(NpcLoader.randomFemaleNpcImageHtml(), true);
        CommentBoard.writeMessage("想卖城堡？来找我就对了！");
        // 加一个返回地图的表单，出售城堡后使用。
        $("#_comment_board_extension_0").html(() => {
            // noinspection HtmlUnknownTarget
            let html = "<form action='status.cgi' method='post'>";
            html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            html += "<input type='hidden' name='mode' value='STATUS'>";
            html += "<input type='submit' id='returnMapSubmit'>";
            html += "</form>";
            return html;
        });

        if (SetupLoader.isMobileTownDashboardEnabled()) {
            leftPanel.remove();
            rightPanel.attr("colspan", 2);
            $("#messageBoard").closest("table").closest("tr").hide();
            mainTable.find("> tbody:first")
                .find("> tr:last")
                .find("> td:first")
                .removeAttr("width")
                .css("width", "100%")
                .attr("colspan", 2)
                .closest("tr")
                .find("> td:eq(1)")
                .remove();
        }
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#reloadButton").on("click", async () => {
            PageUtils.disableElement("reloadButton");
            await this.dispose();
            PageUtils.triggerClick("reloadSubmit");
        });
        $("#castleButton").on("click", async () => {
            PageUtils.disableElement("castleButton");
            await this.dispose();
            PageUtils.triggerClick("castleSubmit");
        });
        $("#personalButton").on("click", async () => {
            PageUtils.disableElement("personalButton");
            await this.dispose();
            PageUtils.triggerClick("personalSubmit");
        });
        $("#developButton").on("click", async () => {
            PageUtils.disableElement("developButton");
            await this.dispose();
            PageUtils.triggerClick("developSubmit");
        });
        $("#leaveButton").on("click", async () => {
            PageUtils.disableElement("leaveButton");
            await this.dispose();
            PageUtils.triggerClick("leaveSubmit");
        });
        $("#exitButton").on("click", async () => {
            PageUtils.disableElement("exitButton");
            await this.dispose();
            PageUtils.triggerClick("exitSubmit");
        });

        MouseClickEventBuilder.newInstance()
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .onElementClicked("commentBoardManager", async () => {
                $("#commentBoardManager").off("click").off("dblclick");

                const warehouseItemCount = (await new CastleWarehouse(this.credential).open()).storageEquipmentList?.length ?? 0;
                const ranchPetCount = (await new CastleRanch(this.credential).open()).ranchPetList?.length ?? 0;

                $("#commentBoard").html("");
                CommentBoard.writeMessage("城堡仓库目前存有物品数量：<span style='font-weight:bold;color:red'>" + warehouseItemCount + "</span><br>");
                CommentBoard.writeMessage("城堡牧场目前蓄养宠物数量：<span style='font-weight:bold;color:blue'>" + ranchPetCount + "</span><br>");

                const emptyCastle = warehouseItemCount === 0 && ranchPetCount === 0;
                if (!emptyCastle) {
                    CommentBoard.writeMessage("<span style='font-weight:bold'>出于财产保全的考虑，目前禁止您出售城堡，请清理后再来！</span>");
                    return;
                }

                CommentBoard.writeMessage("如果决心出售城堡，请继续（将会有两次弹窗确认）。");
                CommentBoard.writeMessage("<button role='button' style='font-weight:bold;color:red' " +
                    "id='sellButton'>出售城堡</button>");
                $("#sellButton").on("click", async () => {
                    await this._sellCastle();
                });
            })
            .doBind();
    }

    private async reload() {
    }

    private async render() {
        if (SetupLoader.isAutoScrollTopEnabled()) PageUtils.scrollIntoView("systemAnnouncement");
        $(".C_CastleDashboardShortcutButton").off("click");

        // 城堡貌似不需要等待读秒，先隐藏吧
        $("#controlPanel").find("> tbody:first")
            .find("> tr:first > th:first")
            .find("> form:first").hide();

        await this._renderControlPanel();
        await this._renderRoleInformation();
        await this._renderEventBoard();
        await this._renderShortcut();
    }

    private async refresh() {
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
        setTimeout(() => this._showTime(), 500);
    }

    private async _generateControlPanelHTML() {
        let buttonClass = "C_pocket_StatelessElement";
        const sId = SetupLoader.getTownDashboardMainButton();
        if (sId !== 0) buttonClass += " button-" + sId;

        $("#reloadSubmit").hide()
            .closest("form").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='reloadButton'></button>"));
        const reloadButton = $("#reloadButton");
        reloadButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "RELOAD" : "更新";
        });
        $("#castleSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='castleButton'></button>"));
        const castleButton = $("#castleButton");
        castleButton.text(() => {
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
        $("#developSubmit").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='developButton'></button>"));
        const developButton = $("#developButton");
        developButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "行动";
        });
        $("#leaveSubmit").hide()
            .closest("form").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='leaveButton'></button>"));
        const leaveButton = $("#leaveButton");
        leaveButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "离开";
        });
        $("#exitSubmit").hide()
            .closest("form").hide()
            .closest("td")
            .append($("<button role='button' style='height:100%;width:100%;min-height:30px' " +
                "class='" + buttonClass + "' " +
                "id='exitButton'></button>"));
        const exitButton = $("#exitButton");
        exitButton.text(() => {
            return SetupLoader.isAsciiTextButtonEnabled() ? "ACTION" : "退出";
        });
    }

    private async _generateShortcutHTML() {
        const bsId = SetupLoader.getTownDashboardShortcutButton();
        if (bsId < 0) return;
        const buttonClass = "button-" + bsId;

        const controlPanel = $("#controlPanel");
        let tr = controlPanel.find("> tbody:first > tr:eq(1)");
        tr.find("> th:first").html(() => {
            let html = "";
            html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut1' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut4' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            return html;
        });
        tr = controlPanel.find("> tbody:first > tr:eq(2)");
        tr.find("> th:first").html(() => {
            let html = "";
            html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut2' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut5' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            return html;
        });
        tr = controlPanel.find("> tbody:first > tr:eq(4)");
        tr.find("> th:first").html(() => {
            let html = "";
            html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto;text-align:center;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut3' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='" + buttonClass + " C_CastleDashboardShortcutButton' id='shortcut6' style='white-space:nowrap;width:100%'>&nbsp;　　&nbsp;</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            return html;
        });
    }

    private async _renderControlPanel() {
        const controlPanel = $("#controlPanel");

        const castleMenu = controlPanel.find("> tbody:first > tr:eq(1) > td:first")
            .find("> form:first > select:first");
        castleMenu.find("> option[value='CASTLE_INN']").text("★城堡驿站");
        castleMenu.find("> option[value='CASTLE_BANK']").text("★城堡银行");
        castleMenu.find("> option[value='CASTLE_ITEM']").remove();
        castleMenu.find("> option[value='CASTLE_PET']").remove();
        castleMenu.find("> option[value='CASTLE_PETARMY']").remove();
        castleMenu.find("> option[value='CASTLE_SENDITEM']").remove();
        castleMenu.find("> option[value='CASTLE_SENDMONEY']").remove();
        castleMenu.find("> option[value='CASTLE_SENDPET']").remove();
        castleMenu.find("> option[value='CASTLE_MAEKET']").remove();
        castleMenu.find("> option[value='CASTLE_BUILDMACHINE']").remove();
        castleMenu.find("> option[value='CASTLE_CHANGEMACHINE']").remove();
        castleMenu.find("> option").each((_idx, e) => {
            const option = $(e);
            if (_.startsWith(option.val() as string, "====")) option.remove();
        });

        const personalMenu = controlPanel.find("> tbody:first > tr:eq(2) > td:first")
            .find("> form:first > select:first");
        personalMenu.find("> option[value='STATUS_PRINT']").text("★个人状态");
        personalMenu.find("> option[value='LETTER']").text("★设置中心");
        personalMenu.find("> option[value='SALARY']").remove();
        personalMenu.find("> option[value='DIANMING']").removeAttr("style").text("★统计报告");
        personalMenu.find("> option[value='MAGIC']").remove();
        personalMenu.find("> option[value='BATTLE_MES']").text("★团队面板");
        personalMenu.find("> option[value='USE_ITEM']").text("★装备管理");
        personalMenu.find("> option[value='PETSTATUS']").text("★宠物管理");
        personalMenu.find("> option[value='PETBORN']").remove();
        personalMenu.find("> option[value='CHANGE_OCCUPATION']").text("★职业管理");
        personalMenu.find("> option[value='RANK_REMAKE']").text("★个人面板");
        personalMenu.find("> option").each((_idx, e) => {
            const option = $(e);
            if (_.startsWith(option.val() as string, "====")) option.remove();
        });

        const developMenu = controlPanel.find("> tbody:first > tr:eq(4) > td:first")
            .find("select:first");
        developMenu.find("> option[value='CASTLE_DEVELOP']").text("★城堡开发");

    }

    private async _renderRoleInformation() {
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
        $("#roleConsecrateRP").html(() => {
            return consecrateRP?.toString() ?? "-";
        });
        $("#roleAdditionalRP").html(() => {
            return DashboardPageUtils.generateAdditionalRPHtml(additionalRP);
        });
    }

    private async _renderEventBoard() {
        $("#eventBoard").html(() => {
            return this.dashboardPage!.processedEventBoardHtml!;
        });
    }

    private async _renderShortcut() {
        const bsId = SetupLoader.getTownDashboardShortcutButton();
        if (bsId >= 0) {
            for (let i = 1; i <= 6; i++) {
                const btn = $("#shortcut" + i);
                if (btn.length > 0) {
                    const cfg = CastleDashboardShortcutManager.loadCastleDashboardShortcutConfig();
                    const id = cfg.getActualId(i);

                    const title = CastleDashboardShortcutManager.findMapping(id)?.buttonTitle ?? "&nbsp;　　&nbsp;";
                    btn.html(title);
                }
            }
            $(".C_CastleDashboardShortcutButton").on("click", async (event) => {
                const btnId = $(event.target).attr("id") as string;
                const idx = _.parseInt(StringUtils.substringAfter(btnId, "shortcut"));
                const cfg = CastleDashboardShortcutManager.loadCastleDashboardShortcutConfig();
                const mapping = CastleDashboardShortcutManager.findMapping(cfg.getActualId(idx));
                if (!mapping) return;
                const option = $("option[value='" + mapping.option + "']");
                if (option.length === 0) return;
                option.prop("selected", true)
                    .closest("tr")
                    .find("> td:last")
                    .find("> button:first")
                    .trigger("click");
            });
        }
    }

    private async _sellCastle() {
        const warehouseItemCount = (await new CastleWarehouse(this.credential).open()).storageEquipmentList?.length ?? 0;
        const ranchPetCount = (await new CastleRanch(this.credential).open()).ranchPetList?.length ?? 0;
        if (!confirm("城堡仓库库存数量" + warehouseItemCount + "，牧场库存" + ranchPetCount + "，请确认要出售？")) return;
        if (!confirm("请最后一次确认以1.5亿的价格出售城堡？")) return;
        await new CastleDashboard(this.credential).sell();      // 出售城堡
        await new CastleInformation().evictCache();             // 城堡出售后清理缓存
        $("#returnMapSubmit").trigger("click");
    }
}

export {CastleDashboardPageProcessor};