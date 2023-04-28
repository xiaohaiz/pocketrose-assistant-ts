import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";

class TownDashboardProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        $("option[value='LETTER']").text("口袋助手设置");
        $("option[value='LETTER']").css("background-color", "yellow");
    }

}


export = TownDashboardProcessor;