import LocationStateMachine from "../../core/LocationStateMachine";
import PageInterceptor from "../PageInterceptor";

class TangDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("现在位置(");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create().inTang();
    }

}

export = TangDashboardPageInterceptor;