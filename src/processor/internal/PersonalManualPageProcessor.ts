import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalManualPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").remove();

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  口 袋 助 手 用 户 手 册  ＞＞")
            .parent()
            .after("<tr><td id='version'></td></tr>");

        // @ts-ignore
        const version = __VERSION__;
        $("#version")
            .css("background-color", "wheat")
            .css("color", "navy")
            .css("font-weight", "bold")
            .css("text-align", "center")
            .text(version);

        let s = $("center:contains('现在的所持金')").text();
        s = StringUtils.substringBefore(s, " 现在的所持金");
        const roleName = s.substring(2);

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .find("td:first")
            .find("table:first")
            .find("tbody:first")
            .find("> tr:first")
            .find("> td:eq(1)")
            .find("table:first")
            .find("tbody:first")
            .find("> tr:eq(1)")
            .find("td:first")
            .html(roleName);
    }

}

export = PersonalManualPageProcessor;