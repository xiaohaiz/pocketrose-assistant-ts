import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownWeaponHousePageProcessor from "../../processor/internal/TownWeaponHousePageProcessor";

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
            LocationStateMachine.currentLocationStateMachine()
                .load()
                .whenInTown(() => {
                    this.#processor.process();
                })
                .fork();
        }
    }

}

export = TownWeaponHousePageInterceptor;