import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPetRankHouseProcessor from "../../processor/town/TownPetRankHouseProcessor";

class TownPetRankHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 宠物资料馆 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new TownPetRankHouseProcessor().process();
            })
            .fork();
    }

}

export = TownPetRankHousePageInterceptor;