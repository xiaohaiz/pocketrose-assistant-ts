import PageInterceptor from "../PageInterceptor";
import NationalInformationPageProcessor from "../../processor/internal/NationalInformationPageProcessor";

class NationInformationPageInterceptor implements PageInterceptor {

    readonly #processor = new NationalInformationPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("各国资料");
        }
        return false;
    }

    intercept(): void {
        this.#processor.process();
    }

}

export = NationInformationPageInterceptor;