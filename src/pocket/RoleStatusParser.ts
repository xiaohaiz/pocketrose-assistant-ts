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

        return status;
    }

}

export = RoleStatusParser;
