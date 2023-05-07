import PageInterceptor from "../PageInterceptor";
import TownListDashboardProcessor from "../../processor/common/TownListDashboardProcessor";

class TownInformationPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town_print.cgi") {
            return pageText.includes("收益金");
        }
        return false;
    }

    intercept(): void {
        new TownListDashboardProcessor().process();
    }

}

export = TownInformationPageInterceptor;