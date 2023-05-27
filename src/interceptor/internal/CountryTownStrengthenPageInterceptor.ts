import LocationStateMachine from "../../core/LocationStateMachine";
import CountryTownStrengthenPageProcessor from "../../processor/internal/CountryTownStrengthenPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CountryTownStrengthenPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new CountryTownStrengthenPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * 国家．内政．强化．指令 *＞＞");
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

export = CountryTownStrengthenPageInterceptor;