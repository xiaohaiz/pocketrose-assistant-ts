import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class TownGemStoreProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
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

}

export = TownGemStoreProcessor;