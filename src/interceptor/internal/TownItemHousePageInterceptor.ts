import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/state/LocationStateMachine";
import TownItemHousePageProcessor from "../../processor/internal/TownItemHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownItemHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownItemHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　物品屋　□　＞＞");
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

export = TownItemHousePageInterceptor;