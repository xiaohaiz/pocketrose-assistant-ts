import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownDashboardProcessor from "../../processor/town/TownDashboardProcessor";

class TownDashboardPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to TOWN.
        LocationStateMachine.currentLocationStateMachine().inTown();
        new TownDashboardProcessor().process();
    }

}

export = TownDashboardPageInterceptor;