import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import LoginDashboardPageProcessor from "../../processor/internal/LoginDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";

class LoginDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "contnue.cgi") {
            return pageText.includes("继续游戏");
        }
        return false;
    }

    intercept(): void {
        if (TeamMemberLoader.loadTeamMembers().length > 0) {
            new LoginDashboardPageProcessor().process();
        }
    }
}

export = LoginDashboardPageInterceptor;