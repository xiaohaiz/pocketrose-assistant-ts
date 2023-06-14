import _ from "lodash";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import BattleFieldConfigLoader from "../config/BattleFieldConfigLoader";
import SetupLoader from "../config/SetupLoader";
import EventHandler from "../event/EventHandler";
import RankTitleLoader from "../role/RankTitleLoader";
import Role from "../role/Role";
import TownLoader from "../town/TownLoader";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardPageParser {

    readonly #credential: Credential;
    readonly #html: string;
    readonly #battleMode?: boolean;

    readonly #page: TownDashboardPage;

    constructor(credential: Credential, html: string, battleMode?: boolean) {
        this.#credential = credential;
        this.#html = html;
        this.#battleMode = battleMode;
        this.#page = this.#doParse();
    }

    parse() {
        return this.#page;
    }

    #doParse() {
        const page = new TownDashboardPage();
        page.role = new Role();

        // 页面主体由上下两个大表格组成
        const t_0 = $(this.#html)
            .find("table:first")
            .parent()
            .parent()
            .parent()
            .parent();
        const t_1 = t_0.next();

        page.t0Html = $(t_0).html();
        page.t1Html = $(t_1).html();

        const t_0_0 = $(t_0)
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first");

        // 左边面板对应的表格
        const t_0_0_0 = $(t_0_0)
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first");

        // 右边面板对应的表格
        const t_0_0_1 = $(t_0_0)
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:eq(1)")
            .find("> table:first");

        // 解析页面上的内容
        _parseOnlineList(page, t_0);
        _parseMobilization(page, t_0_0);
        _parseTownInformation(page, t_0_0_0);
        _parseMessageNotification(page, t_0_0_1);
        _parseActionNotification(page, t_0_0_1);
        _parseBattleMenu(page, t_0_0_1, this.#credential, this.#battleMode);
        _parseRoleStatus(page, t_0_0_1, t_1.next(), this.#credential);
        _parseEventBoard(page, t_0_0_1);
        _parseConversation(page, t_1);
        _calculateCollectTownTax(page);

        return page;
    }
}

function _parseOnlineList(page: TownDashboardPage, table: JQuery) {
    page.onlineListHtml = $(table)
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .html();
}

function _parseMobilization(page: TownDashboardPage, table: JQuery) {
    $(table)
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> form:first")
        .find("> font:first")
        .each((idx, font) => {
            let c = $(font).text();
            page.mobilizationText = c;
            let b = StringUtils.substringAfterLast(c, "(");
            let a = StringUtils.substringBefore(c, "(" + b);
            b = StringUtils.substringBefore(b, ")");
            const ss = _.split(b, " ");
            const b1 = _.replace(ss[0], "部队", "");
            const b2 = SetupLoader.isQiHanTitleEnabled() ? RankTitleLoader.transformTitle(ss[1]) : ss[1];
            const b3 = ss[2];
            page.processedMobilizationText = a + "(" + b1 + " " + b2 + " " + b3 + ")";
        });
}

function _parseTownInformation(page: TownDashboardPage, table: JQuery) {
    $(table)
        .find("> tbody:first")
        .find("> tr:eq(3)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .each((idx, td) => {
            page.townTax = _.parseInt($(td).text());
        })
        .next()
        .next()
        .each((idx, th) => {
            page.townCountry = $(th).text();
        });
}

function _parseMessageNotification(page: TownDashboardPage, table: JQuery) {
    page.messageNotificationHtml = $(table)
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .html();
}

function _parseActionNotification(page: TownDashboardPage, table: JQuery) {
    $(table).find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> th:first")
        .each((idx, th) => {
            page.actionNotificationHtml = $(th).html();
        })
        .find("> form:first")
        .each((idx, form) => {
            const t = $(form).text();
            page.obtainRole.canConsecrate = t.includes("可以进行下次祭奠了");
        });
}

function _parseBattleMenu(page: TownDashboardPage, table: JQuery, credential: Credential, battleMode?: boolean) {
    $(table).find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(2)")
        .find("> td:first")
        .find("> form:first")   // battle form
        .each((idx, form) => {
            page.townId = $(form).find("input:hidden[name='townid']").val() as string;
            const town = TownLoader.load(page.townId);
            if (town) {
                page.obtainRole.town = town;
                page.obtainRole.location = "TOWN";
            }
            let s = $(form).find("input:hidden[name='ktotal']").val() as string;
            page.obtainRole.battleCount = _.parseInt(s);
            page.battleSessionId = $(form).find("input:hidden[name='sessionid']").val() as string;
            page.battleLevelSelectionHtml = $(form).find("select[name='level']").html();
            page.battleVerificationSource = $(form).find("img:first").attr("src") as string;
        });

    const s = $("<select>" + page.battleLevelSelectionHtml + "</select>");
    if (battleMode) {
        s.find("option").each((idx, option) => {
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
    }
    const preference = new BattleFieldConfigLoader(credential).loadConfig();
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

    page.battleLevelShortcut = count === 1;

    if (count > 0) {
        // 设置了战斗场所偏好
        s.find("option").each((idx, option) => {
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
        s.find("option").each((idx, option) => {
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
    }

    // 删除连续的分隔线
    let delimMatch = false;
    s.find("option").each((idx, option) => {
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
    if (s.find("option:last").text().startsWith("------")) {
        s.find("option:last").remove();
    }
    if (s.find("option:first").text().startsWith("------")) {
        s.find("option:first").remove();
    }


    page.processedBattleLevelSelectionHtml = s.html();
}

function _parseRoleStatus(page: TownDashboardPage, table: JQuery, div: JQuery, credential: Credential) {
    $(table).find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(5)")
        .find("> td:first")
        .find("> select[name='mode']")
        .find("> option[value='LOCAL_RULE']")
        .each((idx, option) => {
            let s = $(option).text();
            page.obtainRole.country = StringUtils.substringBefore(s, "国法");
        });

    $(table).find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> th:first")
        .each((idx, th) => {
            let s = $(th).text();
            page.obtainRole.parseHealth(s);
        })
        .parent()
        .find("> th:last")
        .each((idx, th) => {
            let s = $(th).text();
            page.obtainRole.parseMana(s);
        })
        .parent()
        .next()
        .find("> th:first")
        .each((idx, th) => {
            let s = $(th).text();
            s = StringUtils.substringBefore(s, " Gold");
            page.obtainRole.cash = _.parseInt(s);
        })
        .parent()
        .find("> th:last")
        .each((idx, th) => {
            let s = $(th).text();
            s = StringUtils.substringBefore(s, " EX");
            page.obtainRole.experience = _.parseInt(s);
        })
        .parent()
        .next()
        .find("> th:first")
        .each((idx, th) => {
            let s = $(th).text();
            s = StringUtils.substringAfterLast(s, " ");
            page.obtainRole.rank = s;
        })

    $(div).find("> table:first")
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
        .each((_i, td) => {
            const text = $(td).text();
            let idx = text.indexOf("Lv：");
            let s = text.substring(idx);
            page.obtainRole.level = _.parseInt(s.substring(3, s.indexOf(" ")));
            idx = text.indexOf("攻击力：");
            s = text.substring(idx);
            page.obtainRole.attack = _.parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("防御力：");
            s = s.substring(idx);
            page.obtainRole.defense = _.parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("智力：");
            s = s.substring(idx);
            page.obtainRole.specialAttack = _.parseInt(s.substring(3, s.indexOf(" ")));
            idx = s.indexOf("精神力：");
            s = s.substring(idx);
            page.obtainRole.specialDefense = _.parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("速度：");
            s = s.substring(idx);
            page.obtainRole.speed = _.parseInt(s.substring(3));

            page.obtainRole.name = $(td).find("> font:first").find("> b:first").text();
        });

    if (page.obtainRole.level === 150 && !SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
        page.careerTransferNotification = true;
    }
    if (page.obtainRole.level !== 150 && (page.obtainRole.attack === 375 || page.obtainRole.defense === 375
        || page.obtainRole.specialAttack === 375 || page.obtainRole.specialDefense === 375 || page.obtainRole.speed === 375)) {
        page.capacityLimitationNotification = true;
    }
}

function _parseEventBoard(page: TownDashboardPage, table: JQuery) {
    $(table).find("> tbody:first")
        .find("> tr:eq(2)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .each((idx, td) => {
            page.eventBoardHtml = $(td).html();
        });

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

function _parseConversation(page: TownDashboardPage, table: JQuery) {
    let td = $(table).find("> tbody:first")
        .find("> tr:eq(2)")
        .find("> td:first");

    const globalMessageHtml = $(td).find("> table:first").html();
    const personalMessageHtml = $(td).find("> table:eq(1)").html();
    const redPaperMessageHtml = $(td).find("> table:eq(2)").html();
    td = $(td).next();
    const domesticMessageHtml = $(td).find("> table:first").html();
    const unitMessageHtml = $(td).find("> table:eq(1)").html();
    const townMessageHtml = $(td).find("> table:eq(2)").html();

    page.globalMessageHtml = globalMessageHtml;
    page.personalMessageHtml = personalMessageHtml;
    page.redPaperMessageHtml = redPaperMessageHtml;
    page.domesticMessageHtml = domesticMessageHtml;
    page.unitMessageHtml = unitMessageHtml;
    page.townMessageHtml = townMessageHtml;
}

function _calculateCollectTownTax(page: TownDashboardPage) {
    page.canCollectTownTax = false;
    if (SetupLoader.isCollectTownTaxDisabled()) {
        return;
    }
    if (page.obtainRole.country !== "在野" && page.obtainRole.country === page.townCountry) {
        const tax = page.townTax!;
        if (tax >= 50000) {
            if (tax - Math.floor(tax / 50000) * 50000 <= 10000) {
                page.canCollectTownTax = true;
            }
        }
    }
}

export = TownDashboardPageParser;