import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownGemHousePageProcessor from "../../processor/internal/TownGemHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownGemHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownGemHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
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

export = TownGemHousePageInterceptor;