import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class CastleEntranceProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi") {
            return pageText.includes("城堡") && pageText.includes("入口。");
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
    let submit = $("input:submit[value='进入城堡']");
    if (submit.length > 0) {
        submit.trigger("click");
    }
}

export = CastleEntranceProcessor;