import PageUtils from "../../util/PageUtils";
import SetupLoader from "../../setup/SetupLoader";
import RankTitleLoader from "../role/RankTitleLoader";
import Role from "../role/Role";
import Credential from "../../util/Credential";
import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import TownLoader from "../town/TownLoader";
import {BattleConfigManager, MiscConfigManager} from "../../setup/ConfigManager";
import EventHandler from "../event/EventHandler";

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

    battleSessionId?: string;                       // 战斗会话ID
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

    capacityLimitationNotification?: boolean;
    canCollectTownTax?: boolean;

    messageTargetSelectHtml?: string;

    get obtainRole(): Role {
        return this.role!;
    }

    get cashHtml() {
        const cash = this.obtainRole.cash!;
        if (cash >= 1000000) {
            return "<span style='color:red'>" + cash.toLocaleString() + " Gold</span>";
        } else {
            return cash.toLocaleString() + " Gold";
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

}

class TownDashboardPageParser {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    parse(html: string): TownDashboardPage {
        const dom = $(html);

        const page = new TownDashboardPage();
        page.role = new Role();

        // 通过页面顶部的“系统公告”所在的font元素来定位
        const t_0 = dom.find("font:contains('系统公告：')")
            .filter((_idx, e) => {
                const font = $(e);
                return _.startsWith(font.text(), "系统公告：");
            })
            .parent()   // <center>
            .next()     // <br>
            .next();    // <table> first

        // 页面主体由上下两个大表格组成
        const t_1 = t_0.next();

        // 上下两个表格已经成功定位
        page.t0Html = t_0.html();
        page.t1Html = t_1.html();

        const t_0_0 = t_0.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first");

        // 左边面板对应的表格
        const t_0_0_0 = t_0_0.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first");

        // 右边面板对应的表格
        const t_0_0_1 = t_0_0.find("> tbody:first")
            .find("> tr:eq(1) > td:eq(1)")
            .find("> table:first");

        // 解析页面上的内容
        this._parseOnlineList(page, t_0);                   // 解析在线列表
        this._parseMobilization(page, t_0_0);               // 解析动员令
        this._parseTownInformation(page, t_0_0_0);          // 解析城市信息（收益和国家）
        this._parseMessageNotification(page, t_0_0_1);      // 解析是否有新消息得的通知
        this._parseActionNotification(page, t_0_0_1);       // 解析行动通知
        this._parseBattleMenu(page, t_0_0_1);               // 解析战斗菜单
        this._parseRoleStatus(page, t_0_0_1, t_1.next());   // 解析角色信息
        this._parseEventBoard(page, t_0_0_1);               // 处理事件屏
        this._parseConversation(page, t_1);                 // 处理聊天屏
        this._calculateCollectTownTax(page);                // 计算收益相关

        return page;
    }

    private _parseOnlineList(page: TownDashboardPage, t_0: JQuery) {
        page.onlineListHtml = t_0.find("> tbody:first")
            .find("> tr:first > td:first").html();
    }

    private _parseMobilization(page: TownDashboardPage, t_0_0: JQuery) {
        t_0_0.find("> tbody:first")
            .find("> tr:first > td:first")
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

    private _parseTownInformation(page: TownDashboardPage, t_0_0_0: JQuery) {
        t_0_0_0.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1) > td:first")
            .each((idx, td) => {
                page.townTax = _.parseInt($(td).text());
            })
            .closest("tr")
            .find("> th:last")
            .each((idx, th) => {
                page.townCountry = $(th).text();
            });
    }

    private _parseMessageNotification(page: TownDashboardPage, t_0_0_1: JQuery) {
        page.messageNotificationHtml = t_0_0_1.find("> tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .html();
    }

    private _parseActionNotification(page: TownDashboardPage, t_0_0_1: JQuery) {
        const th = t_0_0_1.find("> tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1) > th:first");
        const form = th.find("> form:first");
        page.obtainRole.canConsecrate = _.includes(form.text(), "可以进行下次祭奠了");
        const oldClock = form.find("> input:text[name='clock']");
        if (oldClock.length > 0) {
            // 如果有老的倒计时时钟，则隐藏之并生成新的倒计时时钟代替
            const oldClockValue = oldClock.val() as string;
            oldClock.hide();
            oldClock.after($("<input type='text' name='clock2' size='3' value='" + oldClockValue + "'>"));
        }
        page.actionNotificationHtml = th.html();
    }

    private _parseBattleMenu(page: TownDashboardPage, t_0_0_1: JQuery) {
        t_0_0_1.find("> tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> form:first")   // battle form
            .each((idx, e) => {
                const form = $(e);
                page.townId = form.find("input:hidden[name='townid']").val() as string;
                const town = TownLoader.load(page.townId);
                if (town) {
                    page.obtainRole.town = town;
                    page.obtainRole.location = "TOWN";
                }
                let s = form.find("input:hidden[name='ktotal']").val() as string;
                page.obtainRole.battleCount = _.parseInt(s);
                page.battleSessionId = form.find("input:hidden[name='sessionid']").val() as string;
                page.battleLevelSelectionHtml = form.find("select[name='level']").html();
                page.battleVerificationSource = form.find("img:first").attr("src") as string;
            });

        const s = $("<select>" + page.battleLevelSelectionHtml + "</select>");
        const config = new BattleConfigManager(this.credential).loadBattleFieldConfig();
        page.battleLevelShortcut = config.count === 1;

        if (config.configured) {
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
                    if (!config.primary) {
                        $(option).remove();
                    }
                } else if (text.startsWith("中级之塔")) {
                    if (!config.junior) {
                        $(option).remove();
                    }
                } else if (text.startsWith("上级之洞")) {
                    if (!config.senior) {
                        $(option).remove();
                    }
                } else if (text.startsWith("十二神殿")) {
                    if (!config.zodiac) {
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

    private _parseRoleStatus(page: TownDashboardPage, t_0_0_1: JQuery, div: JQuery) {
        t_0_0_1.find("> tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(5) > td:first")
            .find("> select[name='mode']")
            .find("> option[value='LOCAL_RULE']")
            .each((idx, option) => {
                let s = $(option).text();
                page.obtainRole.country = StringUtils.substringBefore(s, "国法");
            });

        t_0_0_1.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1) > th:first")
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
            .next()
            .next()
            .each((idx, th) => {
                let s = $(th).text();
                s = StringUtils.substringBefore(s, " p");
                page.obtainRole.contribution = _.parseInt(s);
            })

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

        if (page.obtainRole.level !== 150) {
            const d1 = page.obtainRole.attack;
            const d2 = page.obtainRole.defense;
            const d3 = page.obtainRole.specialAttack;
            const d4 = page.obtainRole.specialDefense;
            const d5 = page.obtainRole.speed;
            if ((d1 !== undefined && d1 >= 372) ||
                (d2 !== undefined && d2 >= 372) ||
                (d3 !== undefined && d3 >= 372) ||
                (d4 !== undefined && d4 >= 372) ||
                (d5 !== undefined && d5 >= 372)) {
                page.capacityLimitationNotification = true;
            }
        }
    }

    private _parseEventBoard(page: TownDashboardPage, t_0_0_1: JQuery) {
        t_0_0_1.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1) > td:first")
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

    _parseConversation(page: TownDashboardPage, t_1: JQuery) {
        page.messageTargetSelectHtml = t_1.find("select[name='mes_id']").html();

        let td = t_1.find("> tbody:first")
            .find("> tr:eq(2) > td:first")

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
    }

    private _calculateCollectTownTax(page: TownDashboardPage) {
        page.canCollectTownTax = false;
        if (new MiscConfigManager(this.credential).isCollectTownTaxDisabled) {
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
}

export {TownDashboardPage, TownDashboardPageParser};