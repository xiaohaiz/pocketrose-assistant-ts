import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class PersonalFastLoginProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 出家 *");
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
    console.log(PageUtils.currentPageHtml());
}

export = PersonalFastLoginProcessor;