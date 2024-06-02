import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeMetro from "../../core/location/LocationModeMetro";
import {MetroDashboardPage, MetroDashboardPageParser} from "../../core/dashboard/MetroDashboardPage";
import {RoleStatusManager} from "../../core/role/RoleStatus";
import PageUtils from "../../util/PageUtils";
import SetupLoader from "../../setup/SetupLoader";
import _ from "lodash";
import {PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {MetroDashboard} from "../../core/dashboard/MetroDashboard";
import TownEntrance from "../../core/town/TownEntrance";
import TownInn from "../../core/inn/TownInn";
import {MetroDashboardButtonProcessor} from "./MetroDashboardButtonProcessor";
import {RoleManager} from "../../widget/RoleManager";
import NpcLoader from "../../core/role/NpcLoader";
import {SevenHeartTaskManager} from "./SevenHeartTaskManager";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import MessageBoard from "../../util/MessageBoard";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import TravelPlan from "../../core/map/TravelPlan";
import Coordinate from "../../util/Coordinate";
import TravelPlanExecutor from "../../core/map/TravelPlanExecutor";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import StorageUtils from "../../util/StorageUtils";

const logger = PocketLogger.getLogger("METRO");

class MetroDashboardPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeMetro;
    private readonly taskManager: SevenHeartTaskManager;
    private readonly buttonProcessor: MetroDashboardButtonProcessor;
    private readonly statusManager: RoleStatusManager;
    private readonly roleManager: RoleManager;
    private readonly equipmentManager: EquipmentManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeMetro;
        this.taskManager = new SevenHeartTaskManager(credential);
        this.buttonProcessor = new MetroDashboardButtonProcessor(credential, this, this.taskManager);
        this.statusManager = new RoleStatusManager(credential);
        this.roleManager = new RoleManager(credential, this.location);
        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.onRefresh = async () => {
            await this.refresh(true, true, false);
        };
    }

    dashboardPage?: MetroDashboardPage;
    nextActionEpochMillis?: number;

    protected async doProcess(): Promise<void> {
        await this.initializeProcessor();
        await this.generateHTML();
        await this.resetMessageBoard();
        this.buttonProcessor.bindButtons();
        this.roleManager.bindButtons();
        this.equipmentManager.bindButtons();
        await this.bindButtons();
        await this.reload(false);
        await this.roleManager.render();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("reloadButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async initializeProcessor() {
        // Trigger expired RoleStatus eviction.
        await this.statusManager.load();
        // Unset town
        await this.statusManager.unsetTown();

        const pageHTML = PageUtils.currentPageHtml();
        this.dashboardPage = MetroDashboardPageParser.parse(pageHTML);
        this._calculateNextActionTime();
    }

    private async generateHTML() {
        await this._generateSystemAnnouncementHTML();
        const mainTable = $("body:first > table:first").attr("id", "mainTable");
        await this._generateOnlineListHTML(mainTable);          // 不显示在线名单
        await this._generateMobilizationHTML(mainTable);        // 不显示国家动员令，只保留一个时钟
        await this._generatePageHeaderHTML(mainTable);          // 新加页头栏目，必须放在时钟后面，页面原有脚本会更新第一个表单元素
        await this._generateRoleInformationHTML(mainTable);     // 生成角色信息栏目
        await this._generatePanelHTML(mainTable);               // 生成面板架构
        await this._generateStatusPanelHTML();                  // 任务状态面板
        await this._generateOperationPanelHTML();               // 操作面板
        await this._generateMessageBoardHTML(mainTable);        // 消息面板
        await this._generateEquipmentHTML(mainTable);           // 装备管理
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            // noinspection HtmlUnknownTarget
            let form = "<form action='status.cgi' method='post'>";
            form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            form += "<input type='hidden' name='mode' value='STATUS'>";
            form += "<input type='submit' id='reloadSubmit'>";
            form += "</form>";
            return form;
        });
        $("#reloadButton").on("click", async () => {
            PageUtils.disableElement("reloadButton");
            await this.dispose();
            PageUtils.triggerClick("reloadSubmit");
        });

        $("#returnButton").on("click", async () => {
            // 返回枫丹，转移据点，自动回复，刷新页面
            PageUtils.disableElement("returnButton");
            await this.dispose();
            await new MetroDashboard(this.credential).returnToFontaine();
            await new TownEntrance(this.credential).changeAccessPoint("12");
            await new TownInn(this.credential).recovery();
            PageUtils.triggerClick("reloadSubmit");
        });

        $("#resetTaskStatus").on("click", async () => {
            await this.taskManager.resetSevenHeartTask();
            await this.refresh(false, false, false);
        });

        const checkbox = $("#autoUseRecoverLotion");
        if (StorageUtils.getBoolean("_ts_008_" + this.credential.id)) {
            checkbox.prop("checked", true);
        }
        checkbox.on("change", async () => {
            const checked = checkbox.prop("checked") as boolean;
            StorageUtils.set("_ts_008_" + this.credential.id, checked ? "1" : "0");
        });

        const roleImageHandler = PocketEvent.newMouseClickHandler();
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .doBind();
    }

    private async reload(reloadPage: boolean = true,
                         reloadRole: boolean = true,
                         reloadEquipment: boolean = true) {
        if (reloadPage) {
            this.dashboardPage = (await new MetroDashboard(this.credential).open())!;
            this._calculateNextActionTime();
            $("#timeoutClock").text("N/A");
        }
        if (reloadRole) {
            await this.roleManager.reload();
        }
        if (reloadEquipment) {
            await this.equipmentManager.reload();
        }
    }

    private async render() {
        if (SetupLoader.isAutoScrollTopEnabled()) PageUtils.scrollIntoView("systemAnnouncement");
        $("#roleInformationManager").html(() => {
            return this.roleManager.role?.imageHTML ?? NpcLoader.getNpcImageHtml("U_041")!;
        });
        $("#moveMode").html(this.dashboardPage!.mode!);
        $("#moveScope").html(this.dashboardPage!.scope!.toString());
        $("#currentLocation").html(this.dashboardPage!.coordinate!.asText());

        await this.buttonProcessor.disableButtons();
        $("#taskMessage").html("");


        // Render task status
        await this._renderSevenHeartTaskStatus();

        // Render task
        await this._renderTask1();
        await this._renderTask2();
        await this._renderTask3();
        await this._renderTask4();
        await this._renderTask5();
        await this._renderTask6();
        await this._renderTask7();
        await this._renderTask8();
        await this._renderTask9();

        PageUtils.enableElement("reloadButton");
        await this.buttonProcessor.renderButtons();

        await this.buttonProcessor.postMetroDashboardRendered();
    }

    private async refresh(reloadPage: boolean = true,
                          reloadRole: boolean = true,
                          reloadEquipment: boolean = true) {
        await this.reload(reloadPage, reloadRole, reloadEquipment);
        await this.roleManager.render();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }

    private async _generateSystemAnnouncementHTML() {
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
    }

    private async _generateOnlineListHTML(mainTable: JQuery) {
        mainTable.find("> tbody:first")
            .find("> tr:first")
            .hide();
    }

    private async _generateMobilizationHTML(mainTable: JQuery) {
        const action1HTML: string = "行动准备完毕";
        const action2HTML: string = "下次行动还需要 " +
            "<span id='timeoutClock' style='color:green'>N/A</span> 秒";
        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .removeAttr("height")
            .find("> form:first")
            .hide()                                             // 隐藏老的时钟所在的表单
            .closest("td")
            .append($("<span style='background-color:lightgreen;font-weight:bold;font-size:120%' " +
                "id='watch2'></span>" +
                "<span id='action1' style='display:none;font-weight:bold'>" + action1HTML + "</span>" +
                "<span id='action2' style='display:none;font-weight:bold'>" + action2HTML + "</span>"));
        this._showTime();
    }

    private async _generatePageHeaderHTML(mainTable: JQuery) {
        const tr = mainTable.find("> tbody:first").find("> tr:eq(2)");
        tr.find("> td:eq(1)").remove();
        tr.find("> td:first")
            .removeAttr("width")
            .attr("colspan", 2)
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 迪 士 尼 乐 园 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const reloadButtonTitle = ButtonUtils.createTitle("更新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("枫丹", "Esc");
            return "<span> <button role='button' " +
                "class='C_pocket_StaticButton C_pocket_StatelessElement' " +
                "id='reloadButton'>" + reloadButtonTitle + "</button></span>" +
                "<span> <button role='button' " +
                "class='C_pocket_StaticButton' " +
                "id='returnButton' disabled>" + returnButtonTitle + "</button></span>";
        });
    }

    private async _generateRoleInformationHTML(mainTable: JQuery) {
        const tr = mainTable.find("> tbody:first")
            .find("> tr:eq(3)");
        tr.find("> td:eq(1)").remove();
        tr.find("> td:first")
            .attr("colspan", 2)
            .css("width", "100%")
            .html(() => {
                return "<table style='background-color:#888888;margin:auto;border-width:0'>" +
                    "<tbody style='text-align:center;background-color:#F8F0E0'>" +
                    "<tr>" +
                    "<td style='width:64px;height:64px' id='roleInformationManager' rowspan='2'>" +
                    NpcLoader.getNpcImageHtml("U_041") +
                    "</td>" +
                    "<td style='width:100%;vertical-align:middle'>" +
                    this.roleManager.generateHTML() +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='font-size:120%'>" +
                    "【移动模式：<span id='moveMode'></span>】 " +
                    "【移动范围：<span id='moveScope'></span>】 " +
                    "【当前坐标：<span id='currentLocation' style='font-weight:bold;color:blue'></span>】</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>";
            });
    }

    private async _generatePanelHTML(mainTable: JQuery) {
        // 左边是状态面板，右边是操作面板
        const tr = mainTable.find("> tbody:first")
            .find("> tr:eq(4)");
        tr.find("> td:first")
            .attr("id", "statusPanel")
            .removeAttr("bgcolor")
            .css("width", "50%")
            .css("background", "#F8F0E0")
            .css("vertical-align", "top");
        tr.find("> td:eq(1)")
            .attr("id", "operationPanel")
            .removeAttr("bgcolor")
            .css("width", "50%")
            .css("background", "#F8F0E0")
            .css("vertical-align", "top");
    }

    private async _generateStatusPanelHTML() {
        const statusPanel = $("#statusPanel");
        statusPanel.html(() => {
            return "<table style='background-color:#888888;margin:auto;width:100%;height:100%;border-width:0'>" +
                "<thead style='text-align:center;background-color:skyblue'>" +
                "<tr>" +
                "<th colspan='3'>感谢末末倾情提供的齐心丹攻略" +
                "<br>" +
                "<button role='button' id='resetTaskStatus' " +
                "class='C_pocket_StaticButton C_pocket_StatelessElement'>清除任务状态</button>" +
                "<br>" +
                "<input type='checkbox' id='autoUseRecoverLotion'><span>匹诺曹战斗自动吃药</span>" +
                this.buttonProcessor.generateHTML() +
                "</th>" +
                "</tr>" +
                "<tr style='background-color:wheat'>" +
                "<th>任务</th>" +
                "<th>状态</th>" +
                "<th>说明</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody style='background-color:#F8F0E0;text-align:center'>" +
                "<tr id='status_1'>" +
                "<td>1</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "在(8,9)和白雪公主问话，选择‘齐心丹’" +
                "</td>" +
                "</tr>" +
                "<tr id='status_2'>" +
                "<td>2</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "移动到匹诺曹处(10,10)，并转移据点" +
                "</td>" +
                "</tr>" +
                "<tr id='status_3'>" +
                "<td>3</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "重装跟匹诺曹战斗，直到打赢" +
                "</td>" +
                "</tr>" +
                "<tr id='status_4'>" +
                "<td>4</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "打赢后跟比诺曹谈话，选择‘抓住你了’" +
                "</td>" +
                "</tr>" +
                "<tr id='status_5'>" +
                "<td>5</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "回到枫丹（据点自动转移）<br>" +
                "换好打葫芦娃的装备后，回到迪士尼。<br>" +
                "打葫芦娃，7hit装和面具，打葫芦娃用血宠" +
                "</td>" +
                "</tr>" +
                "<tr id='status_6'>" +
                "<td>6</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "在(8,9)和白雪公主问话，选择‘匹诺曹抓来了’" +
                "</td>" +
                "</tr>" +
                "<tr id='status_7'>" +
                "<td>7</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "在(8,9)和七个小矮人问话，选择‘把心都交出来炼齐心丹’" +
                "</td>" +
                "</tr>" +
                "<tr id='status_8'>" +
                "<td>8</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "和葫芦娃战斗，直至获胜" +
                "</td>" +
                "</tr>" +
                "<tr id='status_9'>" +
                "<td>9</td>" +
                "<td></td>" +
                "<td style='text-align:left'>" +
                "打赢后跟小矮人谈话，七心宝石入手" +
                "</td>" +
                "</tr>" +
                "<tr style='height:100%'><td colspan='3'></td></tr>" +
                "</tbody>" +
                "</table>";
        });
    }

    private async _generateOperationPanelHTML() {
        const operationPanel = $("#operationPanel");
        operationPanel.html(() => {
            return "<table style='background-color:#888888;margin:auto;width:100%;height:100%;border-width:0'>" +
                "<tbody style='background-color:#F8F0E0;text-align:left;vertical-align:middle'>" +
                "<tr id='task1Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task2Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task3Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task4Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task5Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task6Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task7Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task8Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr id='task9Container'>" +
                "<td></td>" +
                "</tr>" +
                "<tr style='height:100%;text-align:center'><td id='taskMessage'></td></tr>" +
                "</tbody>" +
                "</table>";
        });
    }

    private async _generateMessageBoardHTML(mainTable: JQuery) {
        mainTable.find("> tbody:first")
            .find("> tr:eq(5)")
            .find("> td:first")
            .attr("id", "messageBoardContainer")
            .removeAttr("height");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard").css("background", "black")
            .css("color", "white");
    }

    private async _generateEquipmentHTML(mainTable: JQuery) {
        const tr = mainTable.find("> tbody:first")
            .find("> tr:eq(6)");
        tr.find("> td:eq(1)").remove();
        tr.find("> td:first")
            .removeAttr("width")
            .attr("colspan", 2)
            .html(() => {
                return this.equipmentManager.generateHTML();
            });
    }

    private async _renderSevenHeartTaskStatus() {
        const task = await this.taskManager.loadSevenHeartTask();
        if (task.task1) {
            $("#status_1")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_1").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task2) {
            $("#status_2")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_2").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task3) {
            $("#status_3")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_3").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task4) {
            $("#status_4")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_4").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task5) {
            $("#status_5")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_5").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task6) {
            $("#status_6")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_6").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task7) {
            $("#status_7")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_7").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task8) {
            $("#status_8")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_8").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
        if (task.task9) {
            $("#status_9")
                .find("> td:eq(1)").html("★")
                .next().css("color", "grey");
        } else {
            $("#status_9").find("> td:eq(1)").html("")
                .next().css("color", "black");
        }
    }

    private async _renderTask1() {
        $(".C_task1Button").off("click");
        const container = $("#task1Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("白雪公主") +
                "<span> </span>" +
                "<button role='button' class='C_task1Button' id='task1Button'>向白雪公主询问齐心丹</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task1) {
            PageUtils.disableElement("task1Button");
            container.hide();
        }
        $("#task1Button").on("click", async () => {
            PageUtils.disableElement("task1Button");
            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);
            // 问话
            const r2 = this.credential.asRequest();
            r2.set("select", "baixuegongzhu");
            r2.set("mode", "NPC_ASK");
            await PocketNetwork.post("map.cgi", r2);
            // 齐心丹
            const r3 = this.credential.asRequest();
            r3.set("npc", "baixuegongzhu");
            r3.set("mode", "NPC_ANSWER");
            r3.set("ask", escape("-1#3#齐心丹#"));
            await PocketNetwork.post("map.cgi", r3);

            logger.info("<span style='font-weight:bold;color:yellow'>白雪公主要求你帮她把匹诺曹抓来。</span>");

            await this.taskManager.finishTask(1);
            logger.info("完成了第1个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask2() {
        $(".C_task2Button").off("click");
        const container = $("#task2Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (x === 10 && y === 10) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return this.roleManager.role!.imageHTML +
                "<span> </span>" +
                "<button role='button' class='C_task2Button' id='task2Button'>移动到匹诺曹处</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task2) {
            PageUtils.disableElement("task2Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task1) {
            PageUtils.disableElement("task2Button");
            container.hide();
        }
        $("#task2Button").on("click", async () => {
            PageUtils.disableElement("task2Button");
            PageUtils.disableElement("reloadButton");
            PageUtils.disableElement("returnButton");

            $("#taskMessage").html("<span style='color:red;font-weight:bold;font-size:200%'>" +
                "移动中，请稍后。</span>");

            const plan = new TravelPlan();
            plan.scope = this.dashboardPage!.scope!;
            plan.mode = this.dashboardPage!.mode!;
            plan.source = this.dashboardPage!.coordinate!;
            plan.destination = new Coordinate(10, 10);
            plan.credential = this.credential;
            const executor = new TravelPlanExecutor(plan);
            await executor.execute();

            // 转移据点
            const r1 = this.credential.asRequest();
            r1.set("townid", "");
            r1.set("mode", "ACCESS_POINT");
            const r11 = await PocketNetwork.post("mydata.cgi", r1);
            MessageBoard.processResponseMessage(r11.html);

            await this.taskManager.finishTask(2);
            logger.info("完成了第2个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask3() {
        $(".C_task3Button").off("click");
        const container = $("#task3Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 10 && y === 10)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("匹诺曹") +
                "<span> </span>" +
                "<button role='button' class='C_task3Button' id='task3Button'>和匹诺曹战斗！</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task3) {
            PageUtils.disableElement("task3Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task2) {
            PageUtils.disableElement("task3Button");
            container.hide();
        }
        $("#task3Button").on("click", async () => {
            PageUtils.disableElement("task3Button");

            // 战斗前刷新一下，确保可以战斗了（超时防御）
            const p = (await new MetroDashboard(this.credential).open())!;
            if (p.timeoutInSeconds !== undefined && p.timeoutInSeconds > 0) {
                await this.refresh();
                return;
            }

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);

            // 战斗
            const battleRequest = this.credential.asRequest();
            battleRequest.set("select", "pinuocao");
            battleRequest.set("mode", "NPC_BATTLE");
            const battleResponse = await PocketNetwork.post("map.cgi", battleRequest);

            if (_.includes(battleResponse.html, "将 怪物 全灭！")) {
                // 打赢了匹诺曹
                logger.info("<span style='font-weight:bold;color:yellow'>恭喜，你战胜了匹诺曹！</span>");
                await this.taskManager.finishTask(3);
                logger.info("完成了第3个任务。");
            } else if (_.includes(battleResponse.html, "哼，比鼻子，你还不是个")) {
                logger.info("<span style='font-weight:bold;color:yellow'>可悲的是，你貌似被匹诺曹按在地上摩擦！</span>");
                // 打输了，根据配置自动吃药
                if (StorageUtils.getBoolean("_ts_008_" + this.credential.id)) {
                    await this.equipmentManager.useRecoverLotion();
                }
            }

            await this.refresh();
        });
    }

    private async _renderTask4() {
        $(".C_task4Button").off("click");
        const container = $("#task4Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 10 && y === 10)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("匹诺曹") +
                "<span> </span>" +
                "<button role='button' class='C_task4Button' id='task4Button'>抓住匹诺曹！</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task4) {
            PageUtils.disableElement("task4Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task3) {
            PageUtils.disableElement("task4Button");
            container.hide();
        }
        $("#task4Button").on("click", async () => {
            PageUtils.disableElement("task4Button");

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);

            // 问话
            const r2 = this.credential.asRequest();
            r2.set("select", "pinuocao");
            r2.set("mode", "NPC_ASK");
            const r22 = await PocketNetwork.post("map.cgi", r2);
            const option = $(r22.html).find("option[value='301#1#抓住你了#']");
            if (option.length === 0) return;

            // 抓住你了
            const r3 = this.credential.asRequest();
            r3.set("npc", "pinuocao");
            r3.set("mode", "NPC_ANSWER");
            r3.set("ask", escape("301#1#抓住你了#"));
            await PocketNetwork.post("map.cgi", r3);

            logger.info("<span style='font-weight:bold;color:yellow'>匹诺曹被匿成功抓住。</span>");

            await this.taskManager.finishTask(4);
            logger.info("完成了第4个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask5() {
        $(".C_task5Button").off("click");
        const container = $("#task5Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return this.roleManager.role!.imageHTML +
                "<span> </span>" +
                "<button role='button' class='C_task5Button' id='task5Button'>打葫芦娃的装备和宠就绪</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task5) {
            PageUtils.disableElement("task5Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task4) {
            PageUtils.disableElement("task5Button");
            container.hide();
        }
        $("#task5Button").on("click", async () => {
            PageUtils.disableElement("task5Button");

            await this.taskManager.finishTask(5);
            logger.info("完成了第5个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask6() {
        $(".C_task6Button").off("click");
        const container = $("#task6Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("白雪公主") +
                "<span> </span>" +
                "<button role='button' class='C_task6Button' id='task6Button'>匹诺曹抓来啦</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task6) {
            PageUtils.disableElement("task6Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task5) {
            PageUtils.disableElement("task6Button");
            container.hide();
        }
        $("#task6Button").on("click", async () => {
            PageUtils.disableElement("task6Button");

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);
            // 问话
            const r2 = this.credential.asRequest();
            r2.set("select", "baixuegongzhu");
            r2.set("mode", "NPC_ASK");
            const r22 = await PocketNetwork.post("map.cgi", r2);
            const option = $(r22.html).find("option[value='301#2#匹诺曹抓来了#']");
            if (option.length === 0) return;

            // 匹诺曹抓来了
            const r3 = this.credential.asRequest();
            r3.set("npc", "baixuegongzhu");
            r3.set("mode", "NPC_ANSWER");
            r3.set("ask", escape("301#2#匹诺曹抓来了#"));
            await PocketNetwork.post("map.cgi", r3);

            logger.info("<span style='font-weight:bold;color:yellow'>白雪公主把小矮人交给了你。</span>");

            await this.taskManager.finishTask(6);
            logger.info("完成了第6个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask7() {
        $(".C_task7Button").off("click");
        const container = $("#task7Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("七矮人") +
                "<span> </span>" +
                "<button role='button' class='C_task7Button' id='task7Button'>把心都交出来！</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task7) {
            PageUtils.disableElement("task7Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task6) {
            PageUtils.disableElement("task7Button");
            container.hide();
        }
        $("#task7Button").on("click", async () => {
            PageUtils.disableElement("task7Button");

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);
            // 问话
            const r2 = this.credential.asRequest();
            r2.set("select", "qiairen");
            r2.set("mode", "NPC_ASK");
            const r22 = await PocketNetwork.post("map.cgi", r2);
            const option = $(r22.html)
                .find("option[value='301#3#把心交出来让我炼齐心丹#']");
            if (option.length === 0) return;

            // 把心交出来让我炼齐心丹
            const r3 = this.credential.asRequest();
            r3.set("npc", "qiairen");
            r3.set("mode", "NPC_ANSWER");
            r3.set("ask", escape("301#3#把心交出来让我炼齐心丹#"));
            await PocketNetwork.post("map.cgi", r3);

            logger.info("<span style='font-weight:bold;color:yellow'>七个小矮人绝不屈服，变成葫芦七兄弟！</span>");

            await this.taskManager.finishTask(7);
            logger.info("完成了第7个任务。");

            await this.refresh(true, false, false);
        });
    }

    private async _renderTask8() {
        $(".C_task8Button").off("click");
        const container = $("#task8Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getNpcImageHtml("瓜娃") +
                "<span> </span>" +
                "<button role='button' class='C_task8Button' id='task8Button'>和葫芦娃兄弟战斗！</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task8) {
            PageUtils.disableElement("task8Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task7) {
            PageUtils.disableElement("task8Button");
            container.hide();
        }
        $("#task8Button").on("click", async () => {
            PageUtils.disableElement("task8Button");

            // 战斗前刷新一下，确保可以战斗了（超时防御）
            const p = (await new MetroDashboard(this.credential).open())!;
            if (p.timeoutInSeconds !== undefined && p.timeoutInSeconds > 0) {
                await this.refresh();
                return;
            }

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);

            // 战斗
            const battleRequest = this.credential.asRequest();
            battleRequest.set("select", "qiairen");
            battleRequest.set("mode", "NPC_BATTLE");
            const battleResponse = await PocketNetwork.post("map.cgi", battleRequest);

            if (_.includes(battleResponse.html, "将 七个小矮人 全灭！")) {
                // 打赢了匹诺曹
                logger.info("<span style='font-weight:bold;color:yellow'>恭喜，你战胜了葫芦娃！</span>");
                await this.taskManager.finishTask(8);
                logger.info("完成了第8个任务。");
            } else if (_.includes(battleResponse.html, "矮子里拔长子")) {
                logger.info("<span style='font-weight:bold;color:yellow'>貌似葫芦娃打你和打狗一样！</span>");
                // 打输了，应该飞回枫丹了。。。。
                const role = await new PersonalStatus(this.credential).load();
                if (role.town?.id === "12") {
                    // 确实回到了枫丹，回个血，自动回来
                    await new TownInn(this.credential, "12").recovery();
                    const r2 = this.credential.asRequest();
                    r2.set("select", "0");
                    r2.set("out", "underway");
                    r2.set("mode", "MAP_MOVE");
                    await PocketNetwork.post("map.cgi", r2);
                }
                PageUtils.triggerClick("reloadSubmit");
                return;
            }

            await this.refresh();
        });
    }

    private async _renderTask9() {
        $(".C_task9Button").off("click");
        const container = $("#task9Container");
        container.find("> td:first").html("");
        container.hide();

        const x = this.dashboardPage!.coordinate!.x;
        const y = this.dashboardPage!.coordinate!.y;
        if (!(x === 8 && y === 9)) {
            return;
        }
        container.show();
        container.find("> td:first").html(() => {
            return NpcLoader.getTaskNpcImageHtml("七矮人") +
                "<span> </span>" +
                "<button role='button' class='C_task9Button' id='task9Button'>七颗心都给我挖出来！</button>";
        });
        if ((await this.taskManager.loadSevenHeartTask()).task9) {
            PageUtils.disableElement("task9Button");
            container.hide();
        }
        if (!(await this.taskManager.loadSevenHeartTask()).task8) {
            PageUtils.disableElement("task9Button");
            container.hide();
        }
        $("#task9Button").on("click", async () => {
            PageUtils.disableElement("task9Button");

            // 拜访
            const r1 = this.credential.asRequest();
            r1.set("mode", "MAP_VISIT");
            await PocketNetwork.post("map.cgi", r1);
            // 问话
            const r2 = this.credential.asRequest();
            r2.set("select", "qiairen");
            r2.set("mode", "NPC_ASK");
            const r22 = await PocketNetwork.post("map.cgi", r2);
            const option = $(r22.html)
                .find("option[value='301#5#七颗心都给我挖出来#']");
            if (option.length === 0) return;

            // 七颗心都给我挖出来
            const r3 = this.credential.asRequest();
            r3.set("npc", "qiairen");
            r3.set("mode", "NPC_ANSWER");
            r3.set("ask", escape("301#5#七颗心都给我挖出来#"));
            await PocketNetwork.post("map.cgi", r3);

            logger.info("<span style='font-weight:bold;color:yellow'>七心宝石入手！</span>");

            await this.taskManager.finishTask(9);
            logger.info("完成了第9个任务。");

            await this.taskManager.resetSevenHeartTask();

            await this.refresh(true, false, true);
        });
    }

    private _calculateNextActionTime() {
        const timeout = this.dashboardPage!.timeoutInSeconds;
        if (timeout === undefined || timeout <= 0) {
            // 已经可以行动了
            this.nextActionEpochMillis = undefined;
        } else {
            this.nextActionEpochMillis = Date.now() + timeout * 1000;
        }
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
        const action1 = $("#action1");
        const action2 = $("#action2");
        if (this.nextActionEpochMillis === undefined) {
            action1.show();
            action2.hide();
            $("#taskMessage").html("");
        } else {
            const clock = $("#timeoutClock");
            const now = date.getTime();
            if (now >= this.nextActionEpochMillis) {
                // 已经到时间了
                clock.text("0");
                this.nextActionEpochMillis = undefined;
                action1.show();
                action2.hide();
                $("#taskMessage").html("");
            } else {
                // delta是剩余的秒数
                const delta = _.ceil((this.nextActionEpochMillis - now) / 1000);
                clock.text(_.toString(delta));
                action1.hide()
                action2.show();
                $("#taskMessage").html("<span style='color:red;font-weight:bold;font-size:200%'>" +
                    "读秒中，请稍后。</span>");
            }
        }
        setTimeout(() => this._showTime(), 1000);
    }
}

export {MetroDashboardPageProcessor};