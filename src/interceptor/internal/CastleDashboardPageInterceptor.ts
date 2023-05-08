import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleDashboardPageProcessor from "../../processor/internal/CastleDashboardPageProcessor";

class CastleDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to CASTLE.
        LocationStateMachine.create().inCastle();
        this.#processor.process();
    }

}

export = CastleDashboardPageInterceptor;