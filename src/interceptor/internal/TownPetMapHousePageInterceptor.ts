import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPetMapHousePageProcessor from "../../processor/internal/TownPetMapHousePageProcessor";

class TownPetMapHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownPetMapHousePageProcessor();

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
                this.#processor.process();
            })
            .fork();
    }

}

export = TownPetMapHousePageInterceptor;