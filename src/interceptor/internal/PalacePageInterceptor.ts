import LocationStateMachine from "../../core/LocationStateMachine";
import PalacePageProcessor from "../../processor/internal/PalacePageProcessor";
import PageInterceptor from "../PageInterceptor";

class PalacePageInterceptor implements PageInterceptor {

    readonly #processor = new PalacePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * ") && pageText.includes("皇宫 *＞＞");
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

export = PalacePageInterceptor;