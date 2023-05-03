import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class TownListDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town_print.cgi") {
            return pageText.includes("收益金");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    $("td:contains('枫丹')")
        .filter(function () {
            return $(this).text() === "枫丹";
        })
        .next()
        .next()
        .find("font:first")
        .text("- GOLD");
}

export = TownListDashboardProcessor;