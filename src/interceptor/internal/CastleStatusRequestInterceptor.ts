import PageUtils from "../../util/PageUtils";
import CastleDashboardProcessor from "../../processor/dashboard/CastleDashboardProcessor";
import {RequestInterceptor} from "../RequestInterceptor";

class CastleStatusRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "castlestatus.cgi";

    process(): void {
        const pageHtml = PageUtils.currentPageHtml();
        const pageText = PageUtils.currentPageText();

        if (pageText.includes("城堡的情報")) {
            new CastleDashboardProcessor(pageHtml, pageText).process();
        }
    }

}

export = CastleStatusRequestInterceptor;