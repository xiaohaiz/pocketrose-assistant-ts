import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastlePostHouseProcessor from "../../processor/castle/CastlePostHouseProcessor";

class CastlePostHousePageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜ * 机车建造厂 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInCastle(() => {
                new CastlePostHouseProcessor().process();
            })
            .fork();
    }

}

export = CastlePostHousePageInterceptor;