import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastlePostHousePageProcessor from "../../processor/internal/CastlePostHousePageProcessor";

class CastlePostHousePageInterceptor implements PageInterceptor {

    readonly #processor = new CastlePostHousePageProcessor();

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
                this.#processor.process();
            })
            .fork();
    }

}

export = CastlePostHousePageInterceptor;