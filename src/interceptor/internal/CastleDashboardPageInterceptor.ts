import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CastleDashboardPageProcessor from "../../processor/internal/CastleDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastleDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .inCastle()
            .then(() => {
                new CastleDashboardPageProcessor().process();
            });
    }

}

export = CastleDashboardPageInterceptor;