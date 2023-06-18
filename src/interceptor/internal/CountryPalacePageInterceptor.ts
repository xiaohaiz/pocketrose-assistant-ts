import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CountryPalacePageProcessor from "../../processor/internal/CountryPalacePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CountryPalacePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new CountryPalacePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * ") && pageText.includes("皇宫 *＞＞");
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

export = CountryPalacePageInterceptor;