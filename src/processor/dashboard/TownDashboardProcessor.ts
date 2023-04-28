import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";

export = TownDashboardProcessor;

class TownDashboardProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
    }

}