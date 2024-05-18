import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {
    PersonalChampionRole,
    TownPersonalChampionPage,
    TownPersonalChampionPageParser
} from "../../core/champion/TownPersonalChampionPage";
import PageUtils from "../../util/PageUtils";
import {TownPersonalChampion} from "../../core/champion/TownPersonalChampion";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {PocketLogger} from "../../pocket/PocketLogger";
import MessageBoard from "../../util/MessageBoard";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import TownInformation from "../../core/dashboard/TownInformation";
import _ from "lodash";
import TownStatus from "../../core/town/TownStatus";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import Role from "../../core/role/Role";
import NpcLoader from "../../core/role/NpcLoader";
import StringUtils from "../../util/StringUtils";
import TownDashboard from "../../core/dashboard/TownDashboard";

const logger = PocketLogger.getLogger("CHAMPION");

class TownPersonalChampionPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
    }

    private championPage?: TownPersonalChampionPage;

    protected async doProcess(): Promise<void> {
        if (!this.townId) return;
        this.championPage = TownPersonalChampionPageParser.parse(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        if (this.championPage!.nextStage) {
            await this.reload();
        }
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .doBind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first")
            .removeAttr("height")
            .find("> tbody:first > tr:first > td:first")
            .find("> table")
            .removeAttr("height");

        table.find("> tbody:first > tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  个 人 天 真  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span style='display:none'> <button role='button' class='C_pocket_StableButton' id='lotteryButton' disabled>彩票</button></span>" +
                "<span style='display:none'> <button role='button' class='C_pocket_StableButton' id='registerButton' disabled>报名</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement C_pocket_StableButton' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement C_pocket_StableButton' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .css("white-space", "nowrap")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:last")
            .removeAttr("align")
            .css("text-align", "center")
            .css("width", "100%")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "traditional")
            .html("");

        const traditional = $("#traditional");
        traditional.parent()
            .before($("<tr><td id='candidates'></td></tr>" +
                "<tr><td id='winners'></td></tr>"));
        traditional.parent()
            .after($("<tr><td id='matchSituation'></td></tr>"));
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
            logger.info("个人天真页面刷新完成。");
            PocketPage.enableStatelessElements();
        });
        $("#_pocket_page_extension_1").html(() => {
            let form = "";
            // noinspection HtmlUnknownTarget
            form += "<form action='town.cgi' method='post'>";
            form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            form += "<input type='hidden' name='town' value='" + this.townId + "'>";
            form += "<input type='hidden' name='mode' value='SINGLE_BATTLE_ENTRY'>";
            form += "<input type='submit' id='registerSubmit'>";
            // name field should be optional
            form += "</form>";
            return form;
        });
        $("#registerButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("registerSubmit");
        });
        $("#_pocket_page_extension_2").html(() => {
            let form = "";
            // noinspection HtmlUnknownTarget
            form += "<form action='town.cgi' method='post'>";
            form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            form += "<input type='hidden' name='town' value='" + this.townId + "'>";
            form += "<input type='hidden' name='mode' value='SINGLE_BATTLE_BUYCAIPIAO'>";
            form += "<input type='submit' id='lotterySubmit'>";
            // name field should be optional
            form += "</form>";
            return form;
        });
        $("#lotteryButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("lotterySubmit");
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
        this.championPage = await new TownPersonalChampion(this.credential, this.townId).open();
    }

    private async render() {
        const registerButton = $("#registerButton");
        if (await this.checkRegistrationPermission()) {
            registerButton.prop("disabled", false)
                .parent().show();
        } else {
            registerButton.prop("disabled", true)
                .parent().hide();
        }
        const lotteryButton = $("#lotteryButton");
        if (this.championPage!.lottery) {
            lotteryButton.prop("disabled", false)
                .parent().show();
        } else {
            lotteryButton.prop("disabled", true)
                .parent().hide();
        }
        $("#matchSituation").html("").parent().hide();

        await this.renderCandidates();
        await this.renderWinners();

        $("#traditional").html(this.championPage!.traditionalHTML!);

        const url = this.championPage?.matchSituationURL;
        if (url) {
            const response = await PocketNetwork.get(url);
            await this.renderMatchSituation(response.html);
        }
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await new TownDashboard(this.credential).open();    // 加载一次城市页面确保活着
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }

    private async checkRegistrationPermission() {
        if (!this.championPage!.registration!) {
            // 比赛日，不能报名
            return false;
        }
        const roleCountry = this.roleManager.role!.country!;
        if (roleCountry === "在野") {
            // 在野武将无人权，不能参加个天
            return false;
        }
        const townName = this.town?.name;
        if (townName === "枫丹") {
            // 枫丹不能报名
            return false;
        }
        const townInformationPage = await new TownInformation().openWithCache();
        const townCountry = townInformationPage.findByName(townName)?.country;
        if (townCountry === "") {
            // 在野城市，不能报名
            return false;
        }
        // 在本国城市才允许报名
        return roleCountry === townCountry;
    }

    private async renderCandidates() {
        const roles = new Map<string, PersonalChampionRole>();
        for (const role of this.championPage!.candidates!) {
            roles.set(role.townName!, role);
        }
        const townInformationPage = await new TownInformation().openWithCache();
        let maxSize = 0;
        const countries = townInformationPage.countries;
        for (const c of countries) {
            const list = townInformationPage.getTownList(c);
            maxSize = _.max([maxSize, list.length])!;
        }

        let html = "";
        html += "<table style='border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='" + (maxSize + 1) + "' " +
            "style='background-color:#E0D0B0;color:red;font-size:120%'>";
        html += "-- 报 名 者 一 览 --";
        html += "</th>";
        html += "</tr>";
        for (const c of countries) {
            const list = townInformationPage.getTownList(c);
            html += "<tr>";
            html += "<th style='background-color:black;color:white;white-space:nowrap'>";
            html += (c === "") ? "★" : c;
            html += "</th>";
            for (let i = 0; i < maxSize; i++) {
                let status: TownStatus | undefined = undefined;
                if (i < list.length) {
                    status = list[i];
                }
                html += "<td>";
                html += this.generateCandidate(status, roles);
                html += "</td>";
            }
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";

        $("#candidates").html(html);
    }

    private generateCandidate(status: TownStatus | undefined, roles: Map<string, PersonalChampionRole>): string {
        let role: PersonalChampionRole | undefined = undefined;
        if (status) {
            role = roles.get(status.name!);
        }
        let html = "";
        html += "<table style='border-width:0;background-color:#F8F0E0;text-align:center'>";
        html += "<tbody>";
        html += "<tr>";
        if (status) {
            html += "<th style='width:80px;background-color:skyblue;white-space:nowrap'>";
            html += status.name;
            html += "</th>";
        } else {
            html += "<th style='width:80px;background-color:#F8F0E0;white-space:nowrap'>";
            html += "&nbsp;";
            html += "</th>";
        }
        html += "</tr>";
        html += "<tr>";
        html += "<td style='width:80px;height:65px'>";
        if (role) {
            html += role.imageHtml;
        }
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private async renderWinners() {
        let html = "";
        html += "<table style='border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='" + this.championPage!.winners!.length + "' " +
            "style='background-color:#E0D0B0;color:red;font-size:120%'>";
        html += "-- 历 代 优 胜 者 --";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        for (const winner of this.championPage!.winners!) {
            html += "<td style='background-color:#F8F0E0;width:65px'>";
            html += winner.imageHtml;
            html += "</td>";
        }
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#winners").html(html);
    }

    private async renderMatchSituation(pageHTML: string) {
        const dom = $(pageHTML);
        const table = dom.find("th:contains('届 个人天真')")
            .filter((_idx, e) => {
                const s = $(e).text();
                return _.startsWith(s, "第") && _.endsWith(s, "届 个人天真");
            })
            .closest("table");

        const title = table.find("> tbody:first > tr:first > th:first").text();

        const cms: ChampionMatch[] = [];
        for (let i = 0; i <= 32; i++) {
            const cm = new ChampionMatch();
            cm.stage = i;
            const s = "第 " + i + " 场";
            const a = table.find("a:contains('" + s + "')")
                .filter((_idx, e) => {
                    return $(e).text() === s;
                });
            cm.url = a.attr("href");

            const tr = a.closest("tr").next();
            let th = tr.find("> td:first")
                .find("> table:first > tbody:first")
                .find("> tr:eq(1) > th:first");
            let img = th.find("> img:first");
            if (img.length > 0) {
                cm.member1 = Role.newInstanceFromImageElement(img);
            }
            if (i !== 32) {
                const td = tr.find("> td:eq(1)");
                if (td.length > 0) {
                    th = td.find("> table:first > tbody:first")
                        .find("> tr:eq(1) > th:first");
                    img = th.find("> img:first");
                    if (img.length > 0) {
                        cm.member2 = Role.newInstanceFromImageElement(img);
                    }
                }
            }
            cms.push(cm);
        }

        let html = "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='background-color:#E8E8D0;text-align:center'>";
        html += "<tr>";
        html += "<th colspan='11' style='background-color:skyblue;font-size:200%'>" + title + "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th colspan='5' style='background-color:wheat;font-size:120%;color:red'>上 半 场</th>";
        html += "<th style='background-color:wheat;font-size:120%;width:128px'>冠 军</th>";
        html += "<th colspan='5' style='background-color:wheat;font-size:120%;color:blue'>下 半 场</th>";
        html += "</tr>";
        for (let i = 0; i < 8; i++) {
            html += "<tr>";
            for (let j = 0; j < 5; j++) {
                const id = "c_" + i + "_" + j;
                html += "<td style='width:64px;height:140px' id='" + id + "'></td>";
            }
            if (i === 0) {
                html += "<td style='width:128px;background-color:wheat;vertical-align:top' rowspan='8' id='championImage'></td>";
            }
            for (let j = 5; j < 10; j++) {
                const id = "c_" + i + "_" + j;
                html += "<td style='width:64px;height:140px'  id='" + id + "'></td>";
            }
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";

        $("#matchSituation").html(html).parent().show();

        _.forEach(cms, it => this.generateMatchHTML(it));
    }

    private generateMatchHTML(cm: ChampionMatch) {
        const n = StringUtils.substringAfterLast(this.championPage!.matchSituationURL!, "/");
        const base = StringUtils.substringBefore(this.championPage!.matchSituationURL!, n);

        if (cm.stage === 31) {
            let html = "<table style='background-color:transparent;margin:auto;border-width:0;border-spacing:0'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='height:12px;font-size:120%'>";
            if (cm.available) {
                html += "<a href='" + base + "singlebattle" + cm.stage + ".htm' target='_blank'>第" + cm.stage + "场</a>";
            } else {
                html += "第" + cm.stage + "场";
            }
            html += "</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + cm.firstImageHTML + "</td>"
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'></td>"
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#c_0_4").html(html);
            html = "<table style='background-color:transparent;margin:auto;border-width:0;border-spacing:0'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='height:12px;font-size:120%'>";
            if (cm.available) {
                html += "<a href='" + base + "singlebattle" + cm.stage + ".htm' target='_blank'>第" + cm.stage + "场</a>";
            } else {
                html += "第" + cm.stage + "场";
            }
            html += "</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + cm.secondImageHTML + "</td>"
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'></td>"
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#c_0_5").html(html);
        } else if (cm.stage === 32) {
            if (cm.member1) {
                const s = $("<span>" + cm.member1.imageHTML + "</span>");
                s.find("> img:first")
                    .attr("width", "128px")
                    .attr("height", "128px");
                $("#championImage").html(s.html());
            }
        } else {
            let html = "<table style='background-color:transparent;margin:auto;border-width:0;border-spacing:0'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='height:12px;font-size:120%'>";
            if (cm.available) {
                html += "<a href='" + base + "singlebattle" + cm.stage + ".htm' target='_blank'>第" + cm.stage + "场</a>";
            } else {
                html += "第" + cm.stage + "场";
            }
            html += "</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + cm.firstImageHTML + "</td>"
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + cm.secondImageHTML + "</td>"
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#" + LOCATIONS[cm.stage!]).html(html);
        }
    }
}

class ChampionMatch {

    stage?: number;
    url?: string;
    member1?: Role;
    member2?: Role;

    get available() {
        return this.member1 && this.member2;
    }

    get firstImageHTML() {
        return this.member1?.imageHTML ?? NpcLoader.getNpcImageHtml("U_041")!;
    }

    get secondImageHTML() {
        return this.member2?.imageHTML ?? NpcLoader.getNpcImageHtml("U_041")!;
    }

}

const LOCATIONS: any = {
    "1": "c_0_0",
    "2": "c_1_0",
    "3": "c_2_0",
    "4": "c_3_0",
    "5": "c_4_0",
    "6": "c_5_0",
    "7": "c_6_0",
    "8": "c_7_0",
    "9": "c_0_9",
    "10": "c_1_9",
    "11": "c_2_9",
    "12": "c_3_9",
    "13": "c_4_9",
    "14": "c_5_9",
    "15": "c_6_9",
    "16": "c_7_9",
    "17": "c_0_1",
    "18": "c_1_1",
    "19": "c_2_1",
    "20": "c_3_1",
    "21": "c_0_8",
    "22": "c_1_8",
    "23": "c_2_8",
    "24": "c_3_8",
    "25": "c_0_2",
    "26": "c_1_2",
    "27": "c_0_7",
    "28": "c_1_7",
    "29": "c_0_3",
    "30": "c_0_6",
};

export {TownPersonalChampionPageProcessor};