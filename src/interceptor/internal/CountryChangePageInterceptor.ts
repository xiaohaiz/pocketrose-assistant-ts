import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CountryChangePageProcessor from "../../processor/internal/CountryChangePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CountryChangePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new CountryChangePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * 仕 官 和 下 野 *＞＞");
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

export = CountryChangePageInterceptor;