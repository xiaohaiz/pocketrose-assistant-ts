import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../core/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownGemHousePageProcessor from "../../processor/internal/TownGemHousePageProcessor";

class TownGemHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownGemHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isGemHouseUIEnabled()) {
            return;
        }
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = TownGemHousePageInterceptor;