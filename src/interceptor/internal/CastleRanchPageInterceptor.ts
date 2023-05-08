import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleRanchPageProcessor from "../../processor/internal/CastleRanchPageProcessor";

class CastleRanchPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleRanchPageProcessor();

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
                this.#processor.process();
            })
            .fork();
    }

}

export = CastleRanchPageInterceptor;