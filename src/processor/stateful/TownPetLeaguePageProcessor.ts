import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import Role from "../../core/role/Role";
import StatefulPageProcessor from "../StatefulPageProcessor";
import _ from "lodash";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {RoleManager} from "../../widget/RoleManager";
import {TownPetLeague, TownPetLeaguePage, TownPetLeaguePageParser} from "../../core/champion/TownPetLeague";
import StringUtils from "../../util/StringUtils";
import TimeoutUtils from "../../util/TimeoutUtils";
import TownDashboard from "../../core/dashboard/TownDashboard";

const logger = PocketLogger.getLogger("LEAGUE");

class TownPetLeaguePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
    }

    private leaguePage?: TownPetLeaguePage;

    protected async doProcess(): Promise<void> {
        this.leaguePage = TownPetLeaguePageParser.parse(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const top = $("body:first > table:first").removeAttr("height");
        const table = top.find("> tbody:first > tr:first > td:first > table:first")
            .removeAttr("height");
        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  宠 物 联 赛  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='registerButton'>报名</button></span>" +
                "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:last")
            .removeAttr("align")
            .css("width", "100%")
            .css("text-align", "center")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first")
            .find("> td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager");

        const form = $("input:submit[value='返回城市']").closest("form");
        form.closest("td").parent().attr("id", "traditionalPetLeague");
        form.prev().remove();
        form.remove();

        $("#traditionalPetLeague").after($("<tr style='display:none'>" +
            "<td id='PetLeagueReportPanel' style='text-align:center'></td>" +
            "</tr>"));
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        const returnButton = $("#returnButton");
        returnButton.on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_ReturnSubmit");
        });
        returnButton.parent().show();
        const refreshButton = $("#refreshButton");
        refreshButton.on("click", async () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            await this.resetMessageBoard();
            await this.refresh();
            logger.info("宠物联赛刷新操作完成。");
            PocketPage.enableStatelessElements();
        });
        refreshButton.parent().show();
        const registerButton = $("#registerButton");
        registerButton.on("click", async () => {
            PocketPage.disableStatelessElements();
            const message = await new TownPetLeague(this.credential, this.townId!).register();
            if (message.success) {
                await this.reload();
                await this.render();
                logger.info("成功报名登陆宠物联赛，成为候补队。");
            }
            PocketPage.enableStatelessElements();
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        roleImageHandler.threshold = 5;
        roleImageHandler.handler = async () => {
            await this.startPetLeagueTrigger();
        };
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
        this.leaguePage = await new TownPetLeague(this.credential, this.townId!).open();
    }

    private async render() {
        $("#PetLeagueReportPanel").html("").parent().hide();

        // 确定是否显示报名按钮
        const registerButton = $("#registerButton");
        if (this.leaguePage!.registration) {
            registerButton.parent().show();
        } else {
            registerButton.parent().hide();
        }

        // 显示传统的宠物联赛页面信息
        $("#traditionalPetLeague").html(() => {
            return this.leaguePage!.traditionalPetLeagueHTML!;
        });

        let url = this.leaguePage?.matchSituationURL;
        if (url) {
            const response = await PocketNetwork.get(url);
            await this.renderPetLeagueMatchSituation(response.html);
        }
        url = this.leaguePage?.leagueCandidateURL;
        if (url) {
            const response = await PocketNetwork.get(url);
            await this.renderPetLeagueCandidate(response.html);
        }
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

    private async renderPetLeagueMatchSituation(pageHTML: string) {
        const reportList: PetLeagueReport[] = [];
        const table = $(pageHTML).find("th:contains('届 宠物联赛')")
            .filter((_idx, e) => {
                const th = $(e);
                const text = th.text();
                return _.startsWith(text, "第") && _.endsWith(text, "届 宠物联赛");
            })
            .closest("table");
        const tableBody = table.find("> tbody:first");
        const title = tableBody.find("> tr:first > th:first").text();
        for (let i = 1; i <= 15; i++) {
            const report = new PetLeagueReport();
            report.index = i;
            const index = 1 + ((i - 1) * 2);
            let tr = tableBody.find("> tr:eq(" + index + ")");
            report.url = tr.find("> td:first > a:first").attr("href");

            tr = tableBody.find("> tr:eq(" + (index + 1) + ")");
            let img = tr.find("> th:first").find("> img:first");
            report.member1 = Role.newInstanceFromImageElement(img);
            img = tr.find("> th:eq(1)").find("> img:first");
            report.member2 = Role.newInstanceFromImageElement(img);
            img = tr.find("> th:eq(2)").find("> img:first");
            report.member3 = Role.newInstanceFromImageElement(img);
            img = tr.find("> th:eq(3)").find("> img:first");
            report.member4 = Role.newInstanceFromImageElement(img);
            img = tr.find("> th:eq(4)").find("> img:first");
            report.member5 = Role.newInstanceFromImageElement(img);
            img = tr.find("> th:eq(5)").find("> img:first");
            report.member6 = Role.newInstanceFromImageElement(img);
            reportList.push(report);
        }
        // Generate report HTML
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='background-color:#E8E8D0;text-align:center'>";
        html += "<tr>";
        html += "<th colspan='8' style='background-color:skyblue;font-size:150%'>" + title + "</th>";
        html += "</tr>";
        for (const report of reportList) {
            html += "<tr>";
            html += "<td style='width:64px;height:64px;vertical-align:middle'>";
            html += "<span style='margin:auto;font-size:300%;font-weight:bold;color:navy'>" +
                report.index + "</span>";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member1?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member2?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member3?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member4?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member5?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += report.member6?.imageHTML ?? "";
            html += "</td>";
            html += "<td style='width:64px;height:64px'>";
            html += "<a href='" + report.url + "' target='_blank'>" +
                "<button role='button' " +
                "style='margin:auto;width:80%;height:80%;font-weight:bold;font-size:120%'>战况</button>" +
                "</a>";
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr id='PetLeagueCandidateList'>";
        html += "<td style='width:64px;height:64px;vertical-align:middle'>";
        html += "<span style='margin:auto;font-size:300%;font-weight:bold;color:navy'>候</span>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "<td style='width:64px;height:64px'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#PetLeagueReportPanel").html(html).parent().show();
    }

    private async renderPetLeagueCandidate(pageHTML: string) {
        const dom = $(pageHTML);
        const table = dom.find("th:contains('宠物联赛候补队一览')")
            .filter((_idx, e) => {
                const th = $(e);
                const text = th.text();
                return _.startsWith(text, "第") &&
                    _.endsWith(text, "届 宠物联赛候补队一览（排名按报名先后次序)");
            })
            .closest("table");
        const candidates: Role[] = [];
        table.find("img")
            .each((_idx, e) => {
                const img = $(e);
                const role = Role.newInstanceFromImageElement(img);
                if (role) candidates.push(role);
            });
        const tr = $("#PetLeagueCandidateList");
        if (tr.length > 0) {
            for (let i = 0; i < _.min([6, candidates.length])!; i++) {
                const candidate = candidates[i];
                tr.find("> td:eq(" + (i + 1) + ")").html(() => {
                    return candidate.imageHTML;
                });
            }
        }
    }

    private triggerStartPermission: boolean = true;    // 是否运行启动

    private async startPetLeagueTrigger() {
        if (!this.triggerStartPermission) return;
        if (this.leaguePage!.registration) {
            // 今天可以报名，明显是周末
            logger.warn("今天是报名日，没有任何赛程进行。");
            this.triggerStartPermission = false;
            return;
        }
        this.triggerStartPermission = false;
        await this.triggerPetLeagueMatchStarting();
    }

    private async triggerPetLeagueMatchStarting() {
        await this.reload();
        await this.render();
        const traditional = this.leaguePage!.traditionalPetLeagueHTML!;
        if (_.includes(traditional, "※ 今日宠物联赛结束")) {
            logger.info("今日宠物联赛还未开启赛程，稍后再来。");
            this.triggerStartPermission = true;
            return;
        }
        if (_.includes(traditional, "※ 本日试合全部结束")) {
            logger.info("今日宠物联赛已经完成全部赛程。");
            return;
        }
        if (_.includes(traditional, "试合完成！")) {
            // 触发了战斗，10秒后继续
            TimeoutUtils.execute(10000, async () => {
                await this.triggerPetLeagueMatchStarting();
            });
            return;
        }
        if (_.includes(traditional, "下次试合还需要等待")) {
            let s = StringUtils.substringAfter(traditional, "下次试合还需要等待");
            s = StringUtils.substringBefore(s, "秒");
            const timeoutInSeconds = _.parseInt(s);
            TimeoutUtils.execute((timeoutInSeconds + 1) * 1000, async () => {
                // 刷新城市主页触发在线
                const dashboardPage = await new TownDashboard(this.credential).open();
                if (dashboardPage !== null) {
                    await this.triggerPetLeagueMatchStarting();
                }
            });
        }
    }
}

class PetLeagueReport {

    index?: number;
    url?: string;
    member1?: Role;
    member2?: Role;
    member3?: Role;
    member4?: Role;
    member5?: Role;
    member6?: Role;

}

export {TownPetLeaguePageProcessor};