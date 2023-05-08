import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownCastleKeeperProcessor from "../../processor/town/TownCastleKeeperProcessor";

class TownCastleKeeperPageInterceptor implements PageInterceptor {
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
                new TownCastleKeeperProcessor().process();
            })
            .fork();
    }

}

export = TownCastleKeeperPageInterceptor;