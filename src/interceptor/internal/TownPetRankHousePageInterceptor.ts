import LocationStateMachine from "../../core/state/LocationStateMachine";
import TownPetRankHousePageProcessor from "../../processor/internal/TownPetRankHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownPetRankHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownPetRankHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 宠物资料馆 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = TownPetRankHousePageInterceptor;