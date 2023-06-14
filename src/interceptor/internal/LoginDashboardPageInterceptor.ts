import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import LoginDashboardPageProcessor from "../../processor/internal/LoginDashboardPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class LoginDashboardPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new LoginDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "contnue.cgi") {
            return pageText.includes("继续游戏");
        }
        return false;
    }

    intercept(): void {
        if (TeamMemberLoader.loadTeamMembers().length > 0) {
            this.#processor.process();
        }
    }
}

export = LoginDashboardPageInterceptor;