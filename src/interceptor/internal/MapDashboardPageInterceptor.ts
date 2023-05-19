import LocationStateMachine from "../../core/LocationStateMachine";
import MapDashboardPageProcessor from "../../processor/internal/MapDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";

class MapDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new MapDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数") && !pageText.includes("迪斯尼乐园");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to MAP.
        LocationStateMachine.create().inMap();
        this.#processor.process();
    }


}

export = MapDashboardPageInterceptor;