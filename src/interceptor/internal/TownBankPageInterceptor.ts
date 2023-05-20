import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownBankPageProcessor from "../../processor/internal/TownBankPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownBankPageInterceptor implements PageInterceptor {

    readonly #processor = new TownBankPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("存入或取出请输入数额后按下确认键");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isPocketBankEnabled()) {
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

export = TownBankPageInterceptor;