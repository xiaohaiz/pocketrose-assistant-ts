import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import MapDashboardProcessor from "../../processor/map/MapDashboardProcessor";

class MapDashboardPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to MAP.
        LocationStateMachine.currentLocationStateMachine().inMap();
        new MapDashboardProcessor().process();
    }


}

export = MapDashboardPageInterceptor;