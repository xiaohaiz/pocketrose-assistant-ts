import RoleStatus from "./RoleStatus";
import StringUtils from "../util/StringUtils";

class RoleStatusParser {

    static parseRoleStatus(pageHtml: string) {
        const status = new RoleStatus();

        const text = $(pageHtml).text();
        status.canConsecrate = text.includes("可以进行下次祭奠了");

        let s = $("option[value='LOCAL_RULE']").text();
        status.country = StringUtils.substringBefore(s, "国法");

        status.townCountry = $("th:contains('支配下')")
            .filter(function () {
                return $(this).text() === "支配下";
            })
            .next()
            .text();

        status.townId = $("input:hidden[name='townid']").val() as string;

        doParseRoleStatus(status, pageHtml);

        return status;
    }

}

function doParseRoleStatus(status: RoleStatus, pageHtml: string) {
    // 读取角色当前的能力值
    const text = $(pageHtml)
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
    const battleCount = parseInt($("input:hidden[name='ktotal']").val() as string);

    status.level = level;
    status.attack = attack;
    status.defense = defense;
    status.specialAttack = specialAttack;
    status.specialDefense = specialDefense;
    status.speed = speed;
    status.battleCount = battleCount;
}

export = RoleStatusParser;
