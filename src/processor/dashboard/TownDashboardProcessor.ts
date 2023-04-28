import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";

class TownDashboardProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
    }

}

export = TownDashboardProcessor;