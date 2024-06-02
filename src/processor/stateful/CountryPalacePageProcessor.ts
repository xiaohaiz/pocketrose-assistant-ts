import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import MessageBoard from "../../util/MessageBoard";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import {TownDashboardPage} from "../../core/dashboard/TownDashboardPage";
import TownDashboard from "../../core/dashboard/TownDashboard";
import {CountryPalacePage, CountryPalacePageParser} from "../../core/country/CountryPalacePage";
import {CountryPalace} from "../../core/country/CountryPalace";
import TownBank from "../../core/bank/TownBank";
import PalaceTaskManager from "../../core/task/PalaceTaskManager";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryPalacePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;
    }

    private taskIds = [1, 2, 4, 5];
    private taskCursor = 0;
    private palacePage?: CountryPalacePage;
    private dashboardPage?: TownDashboardPage;

    protected async doProcess(): Promise<void> {
        await this.initializeProcessor();
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        this.dashboardPage = (await new TownDashboard(this.credential).open()) ?? undefined;
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async initializeProcessor() {
        this.palacePage = CountryPalacePageParser.parse(PageUtils.currentPageHtml());
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first");
        mainTable.removeAttr("height");
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  皇 宫 任 务  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:eq(1)")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .removeAttr("height")
            .attr("id", "messageBoardContainer");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard").css("background-color", "black")
            .css("color", "white");

        mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .css("text-align", "center")
            .attr("id", "palaceTaskPanel")
            .html("");
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_ReturnSubmit");
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            await this.resetMessageBoard();
            await this.refresh();
            logger.info("刷新操作执行完成。");
            PocketPage.enableStatelessElements();
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

    private async reload() {
        this.palacePage = await new CountryPalace(this.credential, this.townId).open();
        this.dashboardPage = (await new TownDashboard(this.credential).open()) ?? undefined;
    }

    private async render() {
        $(".C_taskButton").off("click");

        this.dashboardPage!.executeWhenActionTimeout(
            async () => {
                await this._renderPalacePage();
            },
            () => {
                $("#palaceTaskPanel").html(() => {
                    return "<span style='color:red;font-weight:bold;font-size:300%'>" +
                        "请耐心等待右上角读秒结束！<br>" +
                        "如果已经完成操作，可以自行退出。<br>" +
                        "吐槽：皇宫任务还搞什么需要读秒，真是坑！" +
                        "</span>";
                });
            }
        );
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }

    private async _renderPalacePage() {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>头像</th>";
        html += "<th>名字</th>";
        html += "<th>任务</th>";
        html += "<th>接受</th>";
        html += "<th>完成</th>";
        html += "<th>&nbsp;&nbsp;花&nbsp;&nbsp;</th>";
        html += "<th>详情</th>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml("大司徒") + "</td>";
        html += "<td>诸葛亮</td>";
        html += "<td>杀人</td>";
        html += "<td><button role='button' class='C_taskButton C_acceptButton' id='accept-1'>接受任务</button></td>";
        html += "<td><button role='button' class='C_taskButton C_finishButton' id='finish-1'>完成任务</button></td>";
        html += "<td>" + this.palacePage!.flowerHTMLs[0] + "</td>";
        html += "<td></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml("大司马") + "</td>";
        html += "<td>曹操</td>";
        html += "<td>送钱</td>";
        html += "<td><button role='button' class='C_taskButton C_acceptButton' id='accept-2'>接受任务</button></td>";
        html += "<td><button role='button' class='C_taskButton C_finishButton' id='finish-2'>完成任务</button></td>";
        html += "<td>" + this.palacePage!.flowerHTMLs[1] + "</td>";
        html += "<td></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml("大司空") + "</td>";
        html += "<td>周瑜</td>";
        html += "<td>拜访</td>";
        html += "<td><button role='button' disabled>接受任务</button></td>";
        html += "<td><button role='button' disabled>完成任务</button></td>";
        html += "<td>" + this.palacePage!.flowerHTMLs[2] + "</td>";
        html += "<td></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml("大司寇") + "</td>";
        html += "<td>司马懿</td>";
        html += "<td>杀怪</td>";
        html += "<td><button role='button' class='C_taskButton C_acceptButton' id='accept-4'>接受任务</button></td>";
        html += "<td><button role='button' class='C_taskButton C_finishButton' id='finish-4'>完成任务</button></td>";
        html += "<td>" + this.palacePage!.flowerHTMLs[3] + "</td>";
        html += "<td>";
        let mt = await new PalaceTaskManager(this.credential).monsterTaskHtml();
        if (mt !== "") {
            mt = StringUtils.substringAfter(mt, "杀怪任务：");
            mt = StringUtils.substringBefore(mt, ") ");
            html += mt + ")";
        }
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml("大司农") + "</td>";
        html += "<td>庞统</td>";
        html += "<td>寻找道具</td>";
        html += "<td><button role='button' class='C_taskButton C_acceptButton' id='accept-5'>接受任务</button></td>";
        html += "<td><button role='button' class='C_taskButton C_finishButton' id='finish-5'>完成任务</button></td>";
        html += "<td>" + this.palacePage!.flowerHTMLs[4] + "</td>";
        html += "<td></td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td colspan='7' style='text-align:left'>";
        html += "<button role='button' class='C_taskButton' id='cancel'>取 消 所 有 任 务</button>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";
        $("#palaceTaskPanel").html(html);

        await this._bindPalaceButtons();

        if (this.taskCursor < this.taskIds.length) {
            const taskId = this.taskIds[this.taskCursor++];
            const completeButton = $("#finish-" + taskId);
            if (completeButton.length > 0) completeButton.trigger("click");
        }
    }

    private async _bindPalaceButtons() {
        $(".C_acceptButton").on("click", async (event) => {
            const buttonId = $(event.target).attr("id") as string;
            const taskId = _.parseInt(StringUtils.substringAfterLast(buttonId, "-"));
            const html = await new CountryPalace(this.credential).accept(taskId);
            if (taskId === 4) {
                // 杀怪任务需要额外的处理
                if (html.includes("请去战斗场所消灭")) {
                    const monsterName = $(html)
                        .find("h2:first")
                        .find("> font:first")
                        .text();
                    await new PalaceTaskManager(this.credential).updateMonsterTask(monsterName);
                } else if (html.includes("您当前的任务是杀掉")) {
                    // 当前已经接受了任务
                    const monsterName = $(html)
                        .find("h3:first")
                        .next()
                        .find("> font:first")
                        .find("> b:first")
                        .find("> font:first")
                        .text();
                    await new PalaceTaskManager(this.credential).updateMonsterTask(monsterName);
                }
            }
            await this.refresh();
        });
        $(".C_finishButton").on("click", async (event) => {
            const buttonId = $(event.target).attr("id") as string;
            const taskId = _.parseInt(StringUtils.substringAfterLast(buttonId, "-"));
            const html = await new CountryPalace(this.credential).complete(taskId);
            if (taskId === 4) {
                // 杀怪任务需要额外的处理
                if (html.includes("你还没有完成杀掉")) {
                    const monsterName = $(html)
                        .find("h3:first")
                        .next()
                        .find("> font:first")
                        .find("> b:first")
                        .find("> font:first")
                        .text();
                    await new PalaceTaskManager(this.credential).updateMonsterTask(monsterName);
                } else {
                    // 完成了
                    await new PalaceTaskManager(this.credential).finishMonsterTask();
                }
            }
            await this.refresh();
        });
        $("#cancel").on("click", async () => {
            if (!confirm("请确认要取消所有的任务么？")) return;
            await new TownBank(this.credential, this.townId).withdraw(10);
            await this.roleManager.reload();
            await this.roleManager.render();
            $("#palaceTaskPanel").html(() => {
                return "<span style='color:red;font-weight:bold;font-size:300%'>任务取消中，请耐心等待右上角读秒结束！</span>";
            });
            this.dashboardPage = (await new TownDashboard(this.credential).open())!;
            this.dashboardPage!.executeWhenActionTimeout(async () => {
                await new CountryPalace(this.credential).cancelAll();
                await new PalaceTaskManager(this.credential).finishMonsterTask();
                await new TownBank(this.credential, this.townId).depositAll();
                await this.refresh();
            });
        });
    }
}

export {CountryPalacePageProcessor};