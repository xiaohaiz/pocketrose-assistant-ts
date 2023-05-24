import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";
import PageProcessorContext from "../PageProcessorContext";

class RoleInformationPageProcessor implements PageProcessor {

    process(context?: PageProcessorContext): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
    }

}

export = RoleInformationPageProcessor;