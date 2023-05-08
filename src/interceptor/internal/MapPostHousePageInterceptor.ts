import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import MapPostHousePageProcessor from "../../processor/internal/MapPostHousePageProcessor";

class MapPostHousePageInterceptor implements PageInterceptor {

    readonly #processor = new MapPostHousePageProcessor();

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
                this.#processor.process();
            })
            .fork();
    }

}

export = MapPostHousePageInterceptor;