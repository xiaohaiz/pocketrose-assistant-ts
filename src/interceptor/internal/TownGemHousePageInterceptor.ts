import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownGemHousePageProcessor from "../../processor/internal/TownGemHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

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
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext();
                context.set("townId", townId!);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = TownGemHousePageInterceptor;