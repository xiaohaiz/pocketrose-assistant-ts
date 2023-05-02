import RoleStatus from "./RoleStatus";
import StringUtils from "../util/StringUtils";

class RoleStatusParser {

    static parseRoleStatus(pageHtml: string) {
        return doParseRoleStatus(pageHtml);
    }

}

function doParseRoleStatus(pageHtml: string) {
    const page = $(pageHtml);

    // 读取角色当前的能力值
    const text = page
        .find("#c_001")
        .find("table:last")
        .find("td:first")
        .text();
    let idx = text.indexOf("Lv：");
    let s = text.substring(idx);
    const level = parseInt(s.substring(3, s.indexOf(" ")));
    idx = text.indexOf("攻击力：");
    s = text.substring(idx);
    const attack = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("防御力：");
    s = s.substring(idx);
    const defense = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("智力：");
    s = s.substring(idx);
    const specialAttack = parseInt(s.substring(3, s.indexOf(" ")));
    idx = s.indexOf("精神力：");
    s = s.substring(idx);
    const specialDefense = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("速度：");
    s = s.substring(idx);
    const speed = parseInt(s.substring(3));
    s = page
        .find("input:hidden[name='ktotal']")
        .val() as string;
    const battleCount = parseInt(s);

    const status = new RoleStatus();
    status.level = level;
    status.attack = attack;
    status.defense = defense;
    status.specialAttack = specialAttack;
    status.specialDefense = specialDefense;
    status.speed = speed;
    status.battleCount = battleCount;

    status.canConsecrate = page.text().includes("可以进行下次祭奠了");

    s = page.find("option[value='LOCAL_RULE']").text();
    status.country = StringUtils.substringBefore(s, "国法");

    status.townCountry = page
        .find("th:contains('支配下')")
        .filter(function () {
            return $(this).text() === "支配下";
        })
        .next()
        .text();

    status.townId = page.find("input:hidden[name='townid']").val() as string;

    return status;
}

export = RoleStatusParser;
