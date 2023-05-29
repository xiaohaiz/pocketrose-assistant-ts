import LocationStateMachine from "../../core/LocationStateMachine";
import TownDashboardPageProcessor2 from "../../processor/internal/TownDashboardPageProcessor2";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownDashboardPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownDashboardPageProcessor2();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to TOWN.
        LocationStateMachine.create().inTown();
        this.#processor.process();
    }

}

export = TownDashboardPageInterceptor;