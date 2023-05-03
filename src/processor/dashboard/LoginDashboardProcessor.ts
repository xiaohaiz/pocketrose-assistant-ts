import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class LoginDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "contnue.cgi") {
            return pageText.includes("继续游戏");
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

export = LoginDashboardProcessor;