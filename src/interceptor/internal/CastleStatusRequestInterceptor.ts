import CastleDashboardProcessor from "../../processor/dashboard/CastleDashboardProcessor";
import RequestInterceptor from "../RequestInterceptor";

class CastleStatusRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "castlestatus.cgi";

    process(): void {
        const pageText = document.documentElement.outerText;
        if (pageText.includes("城堡的情報")) {
            new CastleDashboardProcessor().process();
        }
    }

}

export = CastleStatusRequestInterceptor;