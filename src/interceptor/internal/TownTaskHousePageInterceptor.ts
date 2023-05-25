import LocationStateMachine from "../../core/LocationStateMachine";
import TownTaskHousePageProcessor from "../../processor/internal/TownTaskHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownTaskHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownTaskHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 网 球 场 *＞＞");
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

export = TownTaskHousePageInterceptor;