import PageUtils from "../../util/PageUtils";
import PocketroseProcessor from "../PocketroseProcessor";

export = PersonalStatusProcessor;

class PersonalStatusProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        console.log(PageUtils.currentPageHtml());
    }
}