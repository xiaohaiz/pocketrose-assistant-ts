import Role from "../common/Role";
import TownLoader from "../core/TownLoader";
import Credential from "../util/Credential";
import StringUtils from "../util/StringUtils";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboard {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<TownDashboardPage> {
        const action = () => {
            return new Promise<TownDashboardPage>(resolve => {
            });
        };
        return await action();
    }

    static parsePage(html: string) {
        const page = $(html);

        const p = new TownDashboardPage();
        const role = new Role();
        p.role = role;
        role.canConsecrate = page.text().includes("可以进行下次祭奠了");
        role.battleCount = parseInt(page.find("input:hidden[name='ktotal']").val() as string);
        role.country = StringUtils.substringBefore(page.find("option[value='LOCAL_RULE']").text(), "国法");

        p.townCountry = page.find("th:contains('支配下')")
            .filter(function () {
                return $(this).text() === "支配下";
            })
            .next()
            .text();
        p.townId = page.find("input:hidden[name='townid']").val() as string;

        role.town = TownLoader.getTownById(p.townId!)!;
        role.location = "TOWN";

        // 读取角色当前的能力值
        // 奇怪了，读不到指定id的div元素？但是可以读到里面的td子元素
        page.find("td:last")
            .each(function (_idx, td) {
                const text = $(td).text();
                let idx = text.indexOf("Lv：");
                let s = text.substring(idx);
                role.level = parseInt(s.substring(3, s.indexOf(" ")));
                idx = text.indexOf("攻击力：");
                s = text.substring(idx);
                role.attack = parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("防御力：");
                s = s.substring(idx);
                role.defense = parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("智力：");
                s = s.substring(idx);
                role.specialAttack = parseInt(s.substring(3, s.indexOf(" ")));
                idx = s.indexOf("精神力：");
                s = s.substring(idx);
                role.specialDefense = parseInt(s.substring(4, s.indexOf(" ")));
                idx = s.indexOf("速度：");
                s = s.substring(idx);
                role.speed = parseInt(s.substring(3));
            });

        return p;
    }
}

export = TownDashboard;