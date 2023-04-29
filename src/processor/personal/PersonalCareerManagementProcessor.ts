import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";

class PersonalCareerManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
    }

}

export = PersonalCareerManagementProcessor;
