import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownArmorHousePageProcessor from "../../processor/internal/TownArmorHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownArmorHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownArmorHousePageProcessor();

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

export = TownArmorHousePageInterceptor;