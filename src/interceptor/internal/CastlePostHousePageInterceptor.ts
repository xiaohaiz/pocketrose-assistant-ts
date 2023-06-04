import LocationStateMachine from "../../core/state/LocationStateMachine";
import CastlePostHousePageProcessor from "../../processor/internal/CastlePostHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastlePostHousePageInterceptor implements PageInterceptor {

    readonly #processor = new CastlePostHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜ * 机车建造厂 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInCastle(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = CastlePostHousePageInterceptor;