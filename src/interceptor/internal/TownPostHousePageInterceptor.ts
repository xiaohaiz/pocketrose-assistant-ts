import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPostHousePageProcessor from "../../processor/internal/TownPostHousePageProcessor";

class TownPostHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownPostHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宿 屋 *");
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

export = TownPostHousePageInterceptor;