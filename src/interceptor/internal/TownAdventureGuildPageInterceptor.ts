import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPostHousePageProcessor from "../../processor/internal/TownPostHousePageProcessor";

class TownAdventureGuildPageInterceptor implements PageInterceptor {

    readonly #processor = new TownPostHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("*  藏宝图以旧换新业务 *");
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

export = TownAdventureGuildPageInterceptor;