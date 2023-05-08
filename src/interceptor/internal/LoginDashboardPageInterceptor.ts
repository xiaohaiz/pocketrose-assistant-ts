import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../core/SetupLoader";
import LoginDashboardPageProcessor from "../../processor/internal/LoginDashboardPageProcessor";

class LoginDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new LoginDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "contnue.cgi") {
            return pageText.includes("继续游戏");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isFastLoginEnabled()) {
            return;
        }
        this.#processor.process();
    }
}

export = LoginDashboardPageInterceptor;