import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import MapPostHouseProcessor from "../../processor/map/MapPostHouseProcessor";

class MapPostHousePageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("＜＜住所＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInMap(() => {
                new MapPostHouseProcessor().process();
            })
            .fork();
    }

}

export = MapPostHousePageInterceptor;