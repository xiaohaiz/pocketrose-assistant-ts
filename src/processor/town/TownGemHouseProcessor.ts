import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownGemHouse from "../../pocket/house/TownGemHouse";
import TownGemHousePage from "../../pocket/house/TownGemHousePage";

class TownGemHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        TownGemHouse.parsePage(PageUtils.currentPageHtml())
            .then(page => {
                doProcess(page);
            });
    }

}

function doProcess(page: TownGemHousePage) {
}

export = TownGemHouseProcessor;