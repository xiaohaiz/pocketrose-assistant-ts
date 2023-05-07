import PageInterceptor from "../PageInterceptor";
import EventDashboardProcessor from "../../processor/common/EventDashboardProcessor";

class NationInformationPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("各国资料");
        }
        return false;
    }

    intercept(): void {
        new EventDashboardProcessor().process();
    }
}

export = NationInformationPageInterceptor;