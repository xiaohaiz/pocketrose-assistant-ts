import _ from "lodash";
import Role from "../common/Role";
import TownLoader from "../core/TownLoader";
import StringUtils from "../util/StringUtils";

class TownDashboardPage {

    role?: Role;
    townId?: string;
    townCountry?: string;
    townTax?: number;

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

        role.town = TownLoader.getTownById(page.townId!)!;
        role.location = "TOWN";

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

        return page;
    }
}

export = TownDashboardPage;