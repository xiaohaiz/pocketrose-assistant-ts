import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/state/LocationStateMachine";
import TownAccessoryHousePageProcessor from "../../processor/internal/TownAccessoryHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownAccessoryHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownAccessoryHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　饰品屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isPocketSuperMarketEnabled()) {
            return;
        }
        LocationStateMachine.create()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = TownAccessoryHousePageInterceptor;