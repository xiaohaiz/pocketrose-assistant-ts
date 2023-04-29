import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";

class CastleDashboardProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        doRenderPostHouseMenu();
    }
}

function doRenderPostHouseMenu() {
    $("option[value='CASTLE_BUILDMACHINE']").text("城堡驿站");
    $("option[value='CASTLE_BUILDMACHINE']").css("background-color", "yellow");
}

export = CastleDashboardProcessor;