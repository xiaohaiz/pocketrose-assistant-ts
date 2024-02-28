import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPersonalJoustPageProcessor from "../../processor/internal/TownPersonalJoustPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";


class TownPersonalJoustPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownPersonalJoustPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("个人天真 　 会场");
        }
        return false;
    }

    intercept(): void {
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

export = TownPersonalJoustPageInterceptor;