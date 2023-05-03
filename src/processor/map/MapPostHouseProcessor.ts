import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import MapBuilder from "../../pocket/MapBuilder";

class MapPostHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("＜＜住所＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    $("input:submit[value='返回上个画面']").attr("id", "returnButton");
    $("table[height='100%']").removeAttr("height");

    $("table:eq(1)")
        .find("td:first")
        .removeAttr("bgcolor")
        .removeAttr("width")
        .removeAttr("height")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "greenyellow")
        .attr("id", "title")
        .text("＜＜　 住 所 & 简 易 驿 站 　＞＞");

    $("table:eq(4)")
        .find("tr:last")
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td id='roleLocation' style='background-color:#E8E8D0;text-align:right;color:red;font-weight:bold' colspan='3'>-</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>计时器</td>" +
            "<td id='countDownTimer' style='background-color:#E8E8D0;text-align:right;color:red;font-weight:bold' colspan='3'>-</td>" +
            "</tr>" +
            "<tr style='display:none'><td id='eden' colspan='4'></td></tr>"
        ));

    $("table:eq(5)")
        .find("td:first")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .attr("id", "messageBoard")
        .html("简易驿站能带您去地图上任意的一个坐标点，也仅此而已。")
        .next()
        .html(NpcLoader.randomNpcImageHtml());

    let html = "";
    html += "<tr>";
    html += "<td id='postHouse' style='background-color:#F8F0E0;text-align:center'>";
    html += "</td>"
    html += "</tr>";

    $("#returnButton")
        .closest("tr")
        .after($(html));

    doRender(credential);
}

function doRender(credential: Credential) {
    $("#postHouse").html(MapBuilder.buildMapTable());
    MapBuilder.updateTownBackgroundColor();
}

export = MapPostHouseProcessor;