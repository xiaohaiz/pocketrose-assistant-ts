import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleRanchProcessor from "../../processor/castle/CastleRanchProcessor";

class CastleRanchPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡牧场　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInCastle(() => {
                new CastleRanchProcessor().process();
            })
            .fork();
    }

}

export = CastleRanchPageInterceptor;