import LocationStateMachine from "../../core/state/LocationStateMachine";
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
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext().withTownId(townId);
                this.#processor.process(context);
            })
            .fork();
    }


}

export = CountryChangePageInterceptor;