import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

class TownInformationPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
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

export = TownInformationPageProcessor;