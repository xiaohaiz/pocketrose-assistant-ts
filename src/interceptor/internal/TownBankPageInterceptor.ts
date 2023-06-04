import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownBankPageProcessor from "../../processor/internal/TownBankPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownBankPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownBankPageProcessor();

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
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        this.#processor.process(context);
                    })
                    .process();
            });
    }

}

export = TownBankPageInterceptor;