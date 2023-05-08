import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../core/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownCastleKeeperPageProcessor from "../../processor/internal/TownCastleKeeperPageProcessor";

class TownCastleKeeperPageInterceptor implements PageInterceptor {

    readonly #processor = new TownCastleKeeperPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 网 球 场 *＞＞");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isCastleKeeperEnabled()) {
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

export = TownCastleKeeperPageInterceptor;