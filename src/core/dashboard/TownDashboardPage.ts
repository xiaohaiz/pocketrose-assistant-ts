import _ from "lodash";
import Role from "../../common/Role";
import SetupLoader from "../../config/SetupLoader";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import EventHandler from "../EventHandler";
import RankTitleLoader from "../RankTitleLoader";
import TownLoader from "../town/TownLoader";

class TownDashboardPage {

    t0Html?: string;
    t1Html?: string;

    role?: Role;
    townId?: string;
    townCountry?: string;
    townTax?: number;

    onlineListHtml?: string;                        // 在线列表
    mobilizationText?: string;                      // 国家动员令
    processedMobilizationText?: string;             // 国家动员令（处理后）
    messageNotificationHtml?: string;               // 是否有未读消息
    actionNotificationHtml?: string;                // 行动提示

    battleSessionId?: string;                       // 战斗回话ID
    battleLevelSelectionHtml?: string;              // 战斗选项
    processedBattleLevelSelectionHtml?: string;     // 战斗选项（处理后）
    battleLevelShortcut?: boolean;
    battleVerificationSource?: string;              // 验证码源

    eventBoardHtml?: string;                        // 事件面板
    processedEventBoardHtml?: string;               // 事件面板（处理后）

    globalMessageHtml?: string;
    personalMessageHtml?: string;
    redPaperMessageHtml?: string;
    domesticMessageHtml?: string;
    unitMessageHtml?: string;
    townMessageHtml?: string;

    careerTransferNotification?: boolean;
    capacityLimitationNotification?: boolean;

    get obtainRole(): Role {
        return this.role!;
    }

    get cashHtml() {
        const cash = this.obtainRole.cash;
        if (cash! >= 1000000) {
            return "<span style='color:red'>" + cash + " Gold</span>";
        } else {
            return cash + " Gold";
        }
    }

    get experienceHtml() {
        const experience = this.obtainRole.experience!;
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            if (this.obtainRole.level === 150) {
                return "<span style='color:blue'>MAX</span>";
            } else {
                const ratio = this.obtainRole.level! / 150;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                return "<span title='" + experience + " EX'>" + progressBar + "</span>";
            }
        } else {
            return experience + " EX";
        }
    }

    get rankHtml() {
        const rank = this.obtainRole.rank!;
        if (SetupLoader.isQiHanTitleEnabled()) {
            return RankTitleLoader.transformTitle(rank);
        } else {
            return rank;
        }
    }

    static parse(html: string) {
        const page = new TownDashboardPage();
        const role = new Role();
        page.role = role;
        role.canConsecrate = $(html).text().includes("可以进行下次祭奠了");
        role.battleCount = parseInt($(html).find("input:hidden[name='ktotal']").val() as string);
        role.country = StringUtils.substringBefore($(html).find("option[value='LOCAL_RULE']").text(), "国法");

        const townTax = $(html)
            .find("th:contains('收益')")
            .filter((idx, th) => $(th).text() === "收益")
            .next()
            .text();
        page.townTax = _.parseInt(townTax);

        page.townCountry = $(html).find("th:contains('支配下')")
            .filter(function () {
                return $(this).text() === "支配下";
            })
            .next()
            .text();
        page.townId = $(html).find("input:hidden[name='townid']").val() as string;

        role.town = TownLoader.load(page.townId)!;
        role.location = "TOWN";

        $(html).find("td:contains('经验值')")
            .filter((idx, td) => $(td).text() === "经验值")
            .next()
            .each((idx, th) => {
                const ex = $(th).text();
                role.experience = _.parseInt(StringUtils.substringBefore(ex, " EX"));
            })
            .prev()
            .prev()
            .html((idx, eh) => {
                role.cash = _.parseInt(StringUtils.substringBefore(PageUtils.convertHtmlToText(eh), " Gold"));
                return eh;
            })
            .parent()
            .prev()
            .find("> th:first")
            .html((idx, eh) => {
                const et = PageUtils.convertHtmlToText(eh);
                role.parseHealth(et);
                return eh;
            })
            .parent()
            .find("> th:last")
            .html((idx, eh) => {
                const et = PageUtils.convertHtmlToText(eh);
                role.parseMana(et);
                return eh;
            });


        // 读取角色当前的能力值
        // 奇怪了，读不到指定id的div元素？但是可以读到里面的td子元素
        $(html).find("td:last")
            .each(function (_idx, td) {
                const text = $(td).text();
                let idx = text.indexOf("Lv：");
                let s = text.substring(idx);
                role.level = _.parseInt(s.substring(3, s.indexOf(" ")));
                idx = text.indexOf("攻击力：");
                s = text.substring(idx);
                role.attack = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("防御力：");
                s = s.substring(idx);
                role.defense = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("智力：");
                s = s.substring(idx);
                role.specialAttack = _.parseInt(s.substring(3, s.indexOf(" ")));
                idx = s.indexOf("精神力：");
                s = s.substring(idx);
                role.specialDefense = _.parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("速度：");
                s = s.substring(idx);
                role.speed = _.parseInt(s.substring(3));
            });

        // 读取聊天记录
        let td = $(html).find("td:contains('全员的留言')")
            .filter((idx, td) => _.startsWith($(td).text(), "全员的留言"));
        const globalMessageHtml = td.find("> table:first").html();
        const personalMessageHtml = td.find("> table:eq(1)").html();
        const redPaperMessageHtml = td.find("> table:eq(2)").html();
        td = td.next();
        const domesticMessageHtml = td.find("> table:first").html();
        const unitMessageHtml = td.find("> table:eq(1)").html();
        const townMessageHtml = td.find("> table:eq(2)").html();

        page.globalMessageHtml = globalMessageHtml;
        page.personalMessageHtml = personalMessageHtml;
        page.redPaperMessageHtml = redPaperMessageHtml;
        page.domesticMessageHtml = domesticMessageHtml;
        page.unitMessageHtml = unitMessageHtml;
        page.townMessageHtml = townMessageHtml;

        _parseOnlineListHtml(html, page);
        _parseMessageNotificationHtml(html, page);
        _parseEventBoardHtml(html, page);

        return page;
    }
}

function _parseOnlineListHtml(html: string, page: TownDashboardPage) {
    $(html).find("input:submit[value='更新']")
        .parent()   // form
        .parent()   // td
        .parent()   // tr
        .parent()   // tbody
        .parent()   // table
        .parent()   // td
        .parent()   // tr
        .parent()   // tbody
        .parent()   // table
        .parent()   // td
        .parent()   // tr
        .parent()   // tbody
        .parent()   // table
        .parent()   // td
        .parent()   // tr
        .prev()
        .find("> td:first")
        .html((idx, eh) => {
            page.onlineListHtml = eh;
            return eh;
        });
}

function _parseMessageNotificationHtml(html: string, page: TownDashboardPage) {
    $(html).find("input:submit[value='更新']")
        .parent()   // form
        .parent()   // td
        .parent()   // tr
        .prev()     // message notification tr
        .find("> td:first")
        .html((idx, eh) => {
            page.messageNotificationHtml = eh;
            return eh;
        });
}

function _parseEventBoardHtml(html: string, page: TownDashboardPage) {
    const eventHtmlList: string[] = [];
    $(html).find("td:contains('最近发生的事件')")
        .filter(function () {
            return $(this).text() === "最近发生的事件";
        })
        .parent()
        .next()
        .find("td:first")
        .html()
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

    let eventBoardHtml = "";
    eventBoardHtml += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
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

export = TownDashboardPage;