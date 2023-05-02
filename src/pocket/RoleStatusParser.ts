import RoleStatus from "./RoleStatus";
import StringUtils from "../util/StringUtils";

class RoleStatusParser {

    static parseRoleStatus(pageHtml: string) {
        return doParseRoleStatus(pageHtml);
    }

}

function doParseRoleStatus(pageHtml: string) {
    const page = $(pageHtml);

    const status = new RoleStatus();
    status.canConsecrate = page.text().includes("可以进行下次祭奠了");
    status.battleCount = parseInt(page.find("input:hidden[name='ktotal']").val() as string);
    status.country = StringUtils.substringBefore(page.find("option[value='LOCAL_RULE']").text(), "国法");
    status.townCountry = page.find("th:contains('支配下')")
        .filter(function () {
            return $(this).text() === "支配下";
        })
        .next()
        .text();
    status.townId = page.find("input:hidden[name='townid']").val() as string;

    // 读取角色当前的能力值
    // 奇怪了，读不到指定id的div元素？但是可以读到里面的td子元素
    page.find("td[bgcolor='#006000']:last")
        .each(function (_idx, td) {
            const text = $(td).text();
            let idx = text.indexOf("Lv：");
            let s = text.substring(idx);
            status.level = parseInt(s.substring(3, s.indexOf(" ")));
            idx = text.indexOf("攻击力：");
            s = text.substring(idx);
            status.attack = parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("防御力：");
            s = s.substring(idx);
            status.defense = parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("智力：");
            s = s.substring(idx);
            status.specialAttack = parseInt(s.substring(3, s.indexOf(" ")));
            idx = s.indexOf("精神力：");
            s = s.substring(idx);
            status.specialDefense = parseInt(s.substring(4, s.indexOf(" ")));
            idx = s.indexOf("速度：");
            s = s.substring(idx);
            status.speed = parseInt(s.substring(3));
        });

    return status;
}

export = RoleStatusParser;
