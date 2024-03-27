import TownInformationPageProcessor from "../../processor/internal/TownInformationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town_print.cgi") {
            return pageText.includes("收益金");
        }
        return false;
    }

    intercept(): void {
        new TownInformationPageProcessor().process();
    }

}

export = TownInformationPageInterceptor;