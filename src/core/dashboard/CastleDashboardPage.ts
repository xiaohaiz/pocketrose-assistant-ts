import _ from "lodash";
import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import EventHandler from "../event/EventHandler";
import SetupLoader from "../../setup/SetupLoader";
import PageUtils from "../../util/PageUtils";
import RankTitleLoader from "../role/RankTitleLoader";

class CastleDashboardPage {

    role?: Role;
    capacityLimitationNotification?: boolean;

    onlineListHTML?: string;

    eventBoardHtml?: string;                        // 事件面板
    processedEventBoardHtml?: string;               // 事件面板（处理后）

    messageTargetSelectHtml?: string;
    globalMessageHtml?: string;
    personalMessageHtml?: string;
    redPaperMessageHtml?: string;
    domesticMessageHtml?: string;
    unitMessageHtml?: string;
    castleMessageHtml?: string;

    get cashHtml() {
        const cash = this.role!.cash!;
        if (cash >= 1000000) {
            return "<span style='color:red'>" + cash.toLocaleString() + " Gold</span>";
        } else {
            return cash.toLocaleString() + " Gold";
        }
    }

    get experienceHtml() {
        const experience = this.role!.experience!;
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            if (this.role!.level === 150) {
                return "<span style='color:blue'>MAX</span>";
            } else {
                const ratio = this.role!.level! / 150;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                return "<span title='" + experience + " EX'>" + progressBar + "</span>";
            }
        } else {
            return experience + " EX";
        }
    }

    get rankHtml() {
        const rank = this.role!.rank!;
        if (SetupLoader.isQiHanTitleEnabled()) {
            return RankTitleLoader.transformTitle(rank);
        } else {
            return rank;
        }
    }
}

class CastleDashboardPageParser {

    static async parse(pageHTML: string): Promise<CastleDashboardPage> {
        const page = new CastleDashboardPage();
        page.role = new Role();

        const dom = $(pageHTML);
        // 通过页面顶部的“系统公告”所在的font元素来定位
        const containerTable = dom.find("font:contains('系统公告：')")
            .filter((_idx, e) => {
                const font = $(e);
                return _.startsWith(font.text(), "系统公告：");
            })
            .parent()   // <center>
            .next()     // <br>
            .next();    // <table> first

        const mainTable = containerTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first");
        //const leftPanel = mainTable.find("> tbody:first")
        //    .find("> tr:eq(2) > td:first");
        const rightPanel = mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:eq(1)");

        // 解析角色五维
        const div = containerTable.next()   // Sell castle form
            .next();    // div which contains role information
        CastleDashboardPageParser._parseRoleStatus(page, div);

        // 解析在线列表
        page.onlineListHTML = containerTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .html();

        // 解析角色基本信息
        CastleDashboardPageParser._parseRoleInformation(page, rightPanel);

        // 解析事件屏
        CastleDashboardPageParser._parseEventBoard(page, rightPanel);

        // 解析聊天记录
        CastleDashboardPageParser._parseConversation(page, mainTable);

        return page;
    }

    private static _parseRoleStatus(page: CastleDashboardPage, div: JQuery) {
        div.find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .each((_i, e) => {
                const td = $(e);
                const text = td.text();
                let idx = text.indexOf("Lv：");
                let s = text.substring(idx);
                page.role!.level = _.parseInt(s.substring(3, s.indexOf(" ")));
                idx = text.indexOf("攻击力：");
                s = text.substring(idx);
                page.role!.attack = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("防御力：");
                s = s.substring(idx);
                page.role!.defense = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("智力：");
                s = s.substring(idx);
                page.role!.specialAttack = _.parseInt(s.substring(3, s.indexOf(" ")));
                idx = s.indexOf("精神力：");
                s = s.substring(idx);
                page.role!.specialDefense = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("速度：");
                s = s.substring(idx);
                page.role!.speed = _.parseInt(s.substring(3));
                page.role!.name = td.find("> font:first")
                    .find("> b:first").text();
            });

        if (page.role!.level !== 150) {
            const d1 = page.role!.attack;
            const d2 = page.role!.defense;
            const d3 = page.role!.specialAttack;
            const d4 = page.role!.specialDefense;
            const d5 = page.role!.speed;
            if ((d1 !== undefined && d1 >= 372) ||
                (d2 !== undefined && d2 >= 372) ||
                (d3 !== undefined && d3 >= 372) ||
                (d4 !== undefined && d4 >= 372) ||
                (d5 !== undefined && d5 >= 372)) {
                page.capacityLimitationNotification = true;
            }
        }
    }

    private static _parseRoleInformation(page: CastleDashboardPage, rightPanel: JQuery) {
        const roleInformationTable = rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first");
        roleInformationTable.find("> tbody:first")
            .find("> tr:first > th:first")
            .find("> font:first")
            .html((_idx, s) => {
                page.role!.unit = StringUtils.substringBetween(s, "(", "军)");
                return s;
            });
        let tr = roleInformationTable.find("> tbody:first > tr:eq(1)");
        let t = tr.find("> th:first").text();
        page.role!.parseHealth(t);
        t = tr.find("> th:eq(1)").text();
        page.role!.parseMana(t);

        tr = roleInformationTable.find("> tbody:first > tr:eq(2)");
        t = tr.find("> th:first").text();
        page.role!.cash = _.parseInt(StringUtils.substringBefore(t, " Gold"));
        t = tr.find("> th:eq(1)").text();
        page.role!.experience = _.parseInt(StringUtils.substringBefore(t, " EX"));

        tr = roleInformationTable.find("> tbody:first > tr:eq(3)");
        t = tr.find("> th:first").text();
        page.role!.rank = StringUtils.substringAfterLast(t, " ");
        t = tr.find("> th:eq(1)").text();
        page.role!.contribution = _.parseInt(StringUtils.substringBefore(t, " p"));
    }

    private static _parseEventBoard(page: CastleDashboardPage, rightPanel: JQuery) {
        const eventBoardTable = rightPanel.find("> table:first > tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> table:first");
        page.eventBoardHtml = eventBoardTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .html();

        const eventHtmlList: string[] = [];
        page.eventBoardHtml!.split("<br>")
            .filter(it => it.endsWith(")"))
            .map(function (it) {
                // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
                const header = "<font color=\"navy\">●</font>";
                return StringUtils.substringAfter(it, header);
            })
            .map(it => EventHandler.handleWithEventHtml(it))
            .forEach(it => eventHtmlList.push(it));

        let eventBoardHtml = "";
        eventBoardHtml += "<table style='border-width:0;width:100%;height:100%;margin:auto;background-color:#F1F1F1'>";
        eventBoardHtml += "<tbody>";
        eventHtmlList.forEach(it => {
            eventBoardHtml += "<tr>";
            eventBoardHtml += "<th style='color:navy;vertical-align:top'>●</th>";
            eventBoardHtml += "<td style='width:100%'>";
            eventBoardHtml += it;
            eventBoardHtml += "</td>";
            eventBoardHtml += "</tr>";
        });
        eventBoardHtml += "</tbody>";
        eventBoardHtml += "</table>";
        page.processedEventBoardHtml = eventBoardHtml;
    }

    private static _parseConversation(page: CastleDashboardPage, mainTable: JQuery) {
        let tr = mainTable.find("> tbody:first > tr:eq(4)");
        page.messageTargetSelectHtml = tr.find("> td:first > select[name='mes_id']").html();

        tr = mainTable.find("> tbody:first > tr:eq(5)");
        let td = tr.find("> td:first");
        const globalMessageHtml = td.find("> table:first").html();
        const personalMessageHtml = td.find("> table:eq(1)").html();
        const redPaperMessageHtml = td.find("> table:eq(2)").html();
        td = tr.find("> td:eq(1)");
        const domesticMessageHtml = td.find("> table:first").html();
        const unitMessageHtml = td.find("> table:eq(1)").html();
        const townMessageHtml = td.find("> table:eq(2)").html();

        page.globalMessageHtml = globalMessageHtml;
        page.personalMessageHtml = personalMessageHtml;
        page.redPaperMessageHtml = redPaperMessageHtml;
        page.domesticMessageHtml = domesticMessageHtml;
        page.unitMessageHtml = unitMessageHtml;
        page.castleMessageHtml = townMessageHtml;
    }
}

export {CastleDashboardPage, CastleDashboardPageParser};