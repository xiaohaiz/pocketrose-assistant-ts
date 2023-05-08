import PageInterceptor from "../PageInterceptor";
import EventDashboardPageProcessor from "../../processor/internal/EventDashboardPageProcessor";

class NationInformationPageInterceptor implements PageInterceptor {

    readonly #processor = new EventDashboardPageProcessor();

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