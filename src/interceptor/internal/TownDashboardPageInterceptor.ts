import LocationStateMachine from "../../core/state/LocationStateMachine";
import RoleStateMachine from "../../core/state/RoleStateMachine";
import TownDashboardPageProcessor from "../../processor/internal/TownDashboardPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownDashboardPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachine.create()
            .inTown()
            .then(() => {
                LocationStateMachine.create().inTown();
                this.#processor.process();
            });
    }

}

export = TownDashboardPageInterceptor;