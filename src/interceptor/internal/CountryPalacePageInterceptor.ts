import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
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
        if (!SetupLoader.isNewPalaceTaskEnabled()) {
            return;
        }
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext().withTownId(townId);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = CountryPalacePageInterceptor;