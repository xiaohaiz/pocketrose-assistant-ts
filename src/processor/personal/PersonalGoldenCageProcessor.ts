import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";

class PersonalGoldenCageProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:navy;color:yellowgreen;font-size:150%;font-weight:bold'>" +
        "＜＜  黄 金 笼 子  ＞＞" +
        "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("hr:first").before($(html));
    html = $("h2:first").html();
    html = StringUtils.substringAfter(html, "物品 黄金笼子 使用。");
    $("h2:first").remove();
    $("hr:first").after($("<div>" + html + "</div>"));
}

export = PersonalGoldenCageProcessor;