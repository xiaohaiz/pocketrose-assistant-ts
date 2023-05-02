import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class EventDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("各国资料");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
    }


}

export = EventDashboardProcessor;