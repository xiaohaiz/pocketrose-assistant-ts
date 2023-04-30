import PageUtils from "../../util/PageUtils";
import CastleDashboardProcessor from "../../processor/dashboard/CastleDashboardProcessor";
import CastlePostHouseProcessor from "../../processor/castle/CastlePostHouseProcessor";
import RequestInterceptor from "../RequestInterceptor";

class CastleRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "castle.cgi";

    process(): void {
        const pageHtml = PageUtils.currentPageHtml();
        const pageText = PageUtils.currentPageText();

        if (pageText.includes("城堡的情報")) {
            new CastleDashboardProcessor(pageHtml, pageText).process();
            return;
        }

        if (pageText.includes("＜＜ * 机车建造厂 *＞＞")) {
            new CastlePostHouseProcessor(pageHtml, pageText).process();
        }
    }

}

export = CastleRequestInterceptor;