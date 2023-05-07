import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleDashboardPageProcessor from "../../processor/internal/CastleDashboardPageProcessor";

class CastleDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine().inCastle();
        new CastleDashboardPageProcessor().process();
    }

}

export = CastleDashboardPageInterceptor;