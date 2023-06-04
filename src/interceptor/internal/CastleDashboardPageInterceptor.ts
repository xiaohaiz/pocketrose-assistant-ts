import LocationStateMachine from "../../core/state/LocationStateMachine";
import RoleStateMachine from "../../core/state/RoleStateMachine";
import CastleDashboardPageProcessor from "../../processor/internal/CastleDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastleDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachine.create()
            .inCastle()
            .then(() => {
                LocationStateMachine.create().inCastle();
                this.#processor.process();
            });
    }

}

export = CastleDashboardPageInterceptor;