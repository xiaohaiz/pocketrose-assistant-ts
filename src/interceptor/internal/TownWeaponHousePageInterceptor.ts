import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/state/LocationStateMachine";
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
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext().withTownId(townId);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = TownWeaponHousePageInterceptor;