import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownAccessoryHousePageProcessor from "../../processor/internal/TownAccessoryHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownAccessoryHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownAccessoryHousePageProcessor();

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
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        this.#processor.process();
                    })
                    .process();
            });
    }

}

export = TownAccessoryHousePageInterceptor;