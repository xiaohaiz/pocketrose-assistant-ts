import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import MapDashboardPageProcessor from "../../processor/internal/MapDashboardPageProcessor";

class MapDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new MapDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to MAP.
        LocationStateMachine.currentLocationStateMachine().inMap();
        this.#processor.process();
    }


}

export = MapDashboardPageInterceptor;