import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import Constants from "../../util/Constants";

/**
 * ----------------------------------------------------------------------------
 * 个人天真页面数据结构
 * ----------------------------------------------------------------------------
 * - role: 角色信息
 * - candidates: 报名者
 * - winners: 历届优胜者
 * - registration: 是否允许报名
 * - nextStage: 继续下一场
 * - lottery: 是否可以购买彩票
 * ----------------------------------------------------------------------------
 */
class TownPersonalChampionPage {

    role?: Role;
    candidates?: PersonalChampionRole[];
    winners?: PersonalChampionRole[];
    registration?: boolean;
    lottery?: boolean;
    nextStage?: boolean;
    matchSituationURL?: string;             // 战况的URL链接
    traditionalHTML?: string;

}

class TownPersonalChampionPageParser {

    static parse(html: string): TownPersonalChampionPage {
        const page = new TownPersonalChampionPage();

        const dom = $(html);

        // Parse role form page HTML.
        page.role = new Role();
        const roleTable = dom.find("table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first");
        const image = roleTable.find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> img:first")
            .attr("src")!;
        page.role.image = StringUtils.substringAfterLast(image, "/");
        roleTable.find("> tbody:first")
            .find("> tr:first")
            .find("> td:eq(3)")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .each((_idx, tr) => {
                page.role!.name = $(tr).find("> td:first").text();
                page.role!.level = _.parseInt($(tr).find("> td:eq(1)").text());
                page.role!.attribute = StringUtils.substringBefore($(tr).find("> td:eq(2)").text(), "属");
                page.role!.career = $(tr).find("> td:eq(3)").text();
            })
            .next()
            .each((_idx, tr) => {
                let s = $(tr).find("> td:eq(1)").text();
                s = StringUtils.substringBefore(s, " GOLD");
                page.role!.cash = _.parseInt(s);
            });

        // Parse candidates.
        page.candidates = [];
        dom.find("th:contains('比武对手一览')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "比武对手一览");
            })
            .closest("tbody")
            .find("img")
            .each((_idx, img) => {
                const src = $(img).attr("src")!;
                let s = $(img).parent().html();
                s = StringUtils.substringAfter(s, "<br>");
                const name = StringUtils.substringBefore(s, "(");
                let townName = StringUtils.substringBetween(s, "(", ")");
                if (_.endsWith(townName, " 首都")) {
                    townName = StringUtils.substringBefore(townName, " 首都");
                }
                const pcr = new PersonalChampionRole();
                pcr.image = StringUtils.substringAfterLast(src, "/");
                pcr.name = name;
                pcr.townName = townName;
                page.candidates!.push(pcr);
            });

        // Parse winner
        page.winners = [];
        dom.find("th:contains('-- 历 代 优 胜 者 --')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "-- 历 代 优 胜 者 --");
            })
            .closest("tbody")
            .find("img")
            .each((_idx, img) => {
                const src = $(img).attr("src")!;
                let s = $(img).parent().html();
                const name = StringUtils.substringAfter(s, "<br>");
                const pcr = new PersonalChampionRole();
                pcr.image = StringUtils.substringAfterLast(src, "/");
                pcr.name = name;
                page.winners!.push(pcr);
            });

        // Parse registration
        const registerSubmit = dom.find("input:submit[value='登陆比武']");
        page.registration = registerSubmit.length > 0;

        // Parse lottery
        const lotterySubmit = dom.find("input:submit[value='购买彩票']");
        page.lottery = lotterySubmit.length > 0;

        // Parse nextStage
        const nextSubmit = dom.find("input[value='继续下一场']");
        page.nextStage = nextSubmit.length > 0;

        // 用“返回城市”按钮来定位
        const td = dom.find("input:submit[value='返回城市']")
            .closest("form")
            .closest("td");

        page.matchSituationURL = td.find("a:contains('查看战况')")
            .filter((_idx, e) => {
                const s = $(e).text();
                return s === "查看战况";
            })
            .attr("href");

        td.find("> form:last").remove();    // 删除最后的返回表单
        td.find("> hr:last").remove();
        td.find("> form:last").remove();    // 删除购买彩票的表单
        td.find("> hr:last").remove();
        td.find("> form:last").remove();    // 删除登陆比武的表单
        td.find("> hr:last").remove();
        td.find("> center:last").remove();  // 删除历届优胜者
        td.find("> hr:last").remove();
        td.find("> p:first").remove();      // 删除第一个空白的p

        const p = td.find("> p:first");
        p.find("> b:first").remove();
        p.find("> br:first").remove();
        p.find("> table:first").remove();   // 删除参赛者表格
        p.find("> font:first").find("> b[class='dmg']").hide();

        page.traditionalHTML = td.html();

        return page;
    }

}

class PersonalChampionRole {

    name?: string;
    image?: string;
    townName?: string;

    get imageHtml(): string {
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64' title='" + this.name + "'>";
    }
}

export {TownPersonalChampionPage, TownPersonalChampionPageParser, PersonalChampionRole};