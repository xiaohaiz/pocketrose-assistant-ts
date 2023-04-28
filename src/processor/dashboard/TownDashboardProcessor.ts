import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";

class TownDashboardProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        doRenderMenu();
    }

}

function doRenderMenu() {
    $("option[value='LETTER']").text("口袋助手设置");
    $("option[value='LETTER']").css("background-color", "yellow");

    const th = $("th:contains('看不到图片按这里')")
        .filter(function () {
            return $(this).text() === "看不到图片按这里";
        });

    let html = $(th).html();
    html += "<input type='button' id='setupButton' value='助手'>";
    html += "<input type='button' id='equipmentButton' value='装备'>";
    html += "<input type='button' id='petButton' value='宠物'>";
    $(th).html(html);

    $("#setupButton").on("click", function () {
        $("option[value='LETTER']").prop("selected", true);
        $("option[value='LETTER']").closest("td").next().find("input:submit:first").trigger("click");
    });
    $("#equipmentButton").on("click", function () {
        $("option[value='USE_ITEM']").prop("selected", true);
        $("option[value='USE_ITEM']").closest("td").next().find("input:submit:first").trigger("click");
    });
    $("#petButton").on("click", function () {
        $("option[value='PETSTATUS']").prop("selected", true);
        $("option[value='PETSTATUS']").closest("td").next().find("input:submit:first").trigger("click");
    });
}

export = TownDashboardProcessor;