import LocationStateMachine from "../../core/LocationStateMachine";
import TownDashboardPageProcessor from "../../processor/internal/TownDashboardPageProcessor";
import TownDashboardPageProcessor2 from "../../processor/internal/TownDashboardPageProcessor2";
import PageInterceptor from "../PageInterceptor";

class TownDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new TownDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to TOWN.
        LocationStateMachine.create().inTown();
        //this.#processor.process();
        new TownDashboardPageProcessor2().process();
    }

}

export = TownDashboardPageInterceptor;