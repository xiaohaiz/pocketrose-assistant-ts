import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownWeaponHousePageProcessor from "../../processor/internal/TownWeaponHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownWeaponHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownWeaponHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　武器屋　□　＞＞");
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
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        this.#processor.process(context);
                    })
                    .process();
            });
    }

}

export = TownWeaponHousePageInterceptor;