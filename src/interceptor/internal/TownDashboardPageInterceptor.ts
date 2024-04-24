import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownDashboardPageProcessor from "../../processor/stateless/TownDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";

class TownDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .inTown()
            .then(state => {
                const context = PageProcessorContext.whenInTown(state.townId);
                context.withRoleLevel(state.roleLevel);
                context.withRoleCareer(state.roleCareer);
                new TownDashboardPageProcessor().process(context);
            });
    }

}

export = TownDashboardPageInterceptor;