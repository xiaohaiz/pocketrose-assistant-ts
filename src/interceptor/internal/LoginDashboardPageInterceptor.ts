import PageInterceptor from "../PageInterceptor";
import LoginDashboardProcessor from "../../processor/common/LoginDashboardProcessor";

class LoginDashboardPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "contnue.cgi") {
            return pageText.includes("继续游戏");
        }
        return false;
    }

    intercept(): void {
        new LoginDashboardProcessor().process();
    }
}

export = LoginDashboardPageInterceptor;