import _ from "lodash";
import Role from "../common/Role";
import TownLoader from "../core/town/TownLoader";
import PageUtils from "../util/PageUtils";
import StringUtils from "../util/StringUtils";

class TownDashboardPage {

    role?: Role;
    townId?: string;
    townCountry?: string;
    townTax?: number;

    globalMessageHtml?: string;
    personalMessageHtml?: string;
    redPaperMessageHtml?: string;
    domesticMessageHtml?: string;
    unitMessageHtml?: string;
    townMessageHtml?: string;

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

        return page;
    }
}

export = TownDashboardPage;