import PageUtils from "../../util/PageUtils";
import Processor from "../Processor";

class CastleDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

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