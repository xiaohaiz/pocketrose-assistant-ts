import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownArmorHousePageProcessor from "../../processor/internal/TownArmorHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownArmorHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownArmorHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　防具屋　□　＞＞");
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

export = TownArmorHousePageInterceptor;