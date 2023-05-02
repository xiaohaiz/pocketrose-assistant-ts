import TownDashboardProcessor from "../../processor/dashboard/TownDashboardProcessor";
import RequestInterceptor from "../RequestInterceptor";

class StatusRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "status.cgi";

    process(): void {
        const pageText = document.documentElement.outerText;
        if (pageText.includes("城市支配率")) {
            new TownDashboardProcessor().process();
        }
    }

}

export = StatusRequestInterceptor;