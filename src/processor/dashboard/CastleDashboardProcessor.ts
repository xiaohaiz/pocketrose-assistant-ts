import PageUtils from "../../util/PageUtils";
import Processor from "../Processor";

class CastleDashboardProcessor implements Processor {

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