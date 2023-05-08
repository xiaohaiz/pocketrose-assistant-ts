import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPetRankHousePageProcessor from "../../processor/internal/TownPetRankHousePageProcessor";

class TownPetRankHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownPetRankHousePageProcessor();

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
                this.#processor.process();
            })
            .fork();
    }

}

export = TownPetRankHousePageInterceptor;