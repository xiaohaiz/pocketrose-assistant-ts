import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownWeaponStoreProcessor from "../../processor/town/TownWeaponStoreProcessor";

class TownWeaponHousePageInterceptor implements PageInterceptor {

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
                    new TownWeaponStoreProcessor().process();
                })
                .fork();
        }
    }

}

export = TownWeaponHousePageInterceptor;