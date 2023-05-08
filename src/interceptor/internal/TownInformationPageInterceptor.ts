import PageInterceptor from "../PageInterceptor";
import TownInformationPageProcessor from "../../processor/internal/TownInformationPageProcessor";

class TownInformationPageInterceptor implements PageInterceptor {

    readonly #processor = new TownInformationPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town_print.cgi") {
            return pageText.includes("收益金");
        }
        return false;
    }

    intercept(): void {
        this.#processor.process();
    }

}

export = TownInformationPageInterceptor;