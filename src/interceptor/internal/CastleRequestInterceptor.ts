import CastleDashboardProcessor from "../../processor/dashboard/CastleDashboardProcessor";
import CastlePostHouseProcessor from "../../processor/castle/CastlePostHouseProcessor";
import RequestInterceptor from "../RequestInterceptor";

class CastleRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "castle.cgi";

    process(): void {
        const pageText = document.documentElement.outerText;
        if (pageText.includes("城堡的情報")) {
            new CastleDashboardProcessor().process();
            return;
        }
        if (pageText.includes("＜＜ * 机车建造厂 *＞＞")) {
            new CastlePostHouseProcessor().process();
        }
    }

}

export = CastleRequestInterceptor;