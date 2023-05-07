import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPetMapProcessor from "../../processor/town/TownPetMapProcessor";

class TownPetMapHousePageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宠物图鉴 *");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new TownPetMapProcessor().process();
            })
            .fork();
    }

}

export = TownPetMapHousePageInterceptor;