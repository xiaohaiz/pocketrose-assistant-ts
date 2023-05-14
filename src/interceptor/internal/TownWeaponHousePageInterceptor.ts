import LocationStateMachine from "../../core/LocationStateMachine";
import TownWeaponHousePageProcessor from "../../processor/internal/TownWeaponHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import SetupLoader from "../../setup/SetupLoader";
import PageInterceptor from "../PageInterceptor";

class TownWeaponHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownWeaponHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　武器屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        if (SetupLoader.isPocketSuperMarketEnabled()) {
            LocationStateMachine.create()
                .load()
                .whenInTown(townId => {
                    const context = new PageProcessorContext();
                    context.set("townId", townId!);
                    this.#processor.process(context);
                })
                .fork();
        }
    }

}

export = TownWeaponHousePageInterceptor;