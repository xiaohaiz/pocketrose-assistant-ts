import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import LocationSelectionBuilder from "../../pocket/LocationSelectionBuilder";

class TownAdventureGuildProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    const t1 = $("table:eq(1)");
    const t3 = $("table:eq(3)");
    const t4 = $("table:eq(4)");

    $(t1).find("td:first")
        .removeAttr("bgcolor")
        .removeAttr("width")
        .removeAttr("height")
        .css("width", "100%")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  冒 险 家 公 会  ＞＞");

    $(t3).find("tr:last")
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td id='roleLocation' style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' colspan='3'>-</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>计时器</td>" +
            "<td id='countDownTimer' style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' colspan='3'>-</td>" +
            "</tr>"
        ));

    $(t4).find("td:first")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .attr("id", "messageBoard");

    $("form:first").parent()
        .attr("id", "treasureHint")
        .parent()
        .after($("" +
            "<tr>" +
            "<td id='menu' style='width:100%;background-color:#E8E8D0;text-align:center'></td>" +
            "</tr>" +
            "<tr style='display:none'>" +
            "<td id='eden' style='width:100%'></td>" +
            "</tr>" +
            "<tr>" +
            "<td id='location' style='width:100%;background-color:#E8E8D0;text-align:center'></td>" +
            "</tr>" +
            "<tr style='display:none'>" +
            "<td id='treasure' style='width:100%;background-color:#E8E8D0;text-align:center'></td>" +
            "</tr>"
        ));

    doRenderLocation(credential);

}

function doRenderLocation(credential: Credential) {
    const html = LocationSelectionBuilder.buildLocationSelectionTable();
    $("#location").html(html);

    $(".location_button_class")
        .on("mouseenter", function () {
            $(this).css("background-color", "red");
        })
        .on("mouseleave", function () {
            $(this).removeAttr("style");
        });
}

export = TownAdventureGuildProcessor;