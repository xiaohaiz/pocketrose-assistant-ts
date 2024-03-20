import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPersonalChampionPageProcessor from "../../processor/internal/TownPersonalChampionPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";


class TownPersonalChampionPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownPersonalChampionPageProcessor();

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

export = TownPersonalChampionPageInterceptor;