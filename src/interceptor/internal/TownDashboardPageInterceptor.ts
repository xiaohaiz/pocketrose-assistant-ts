import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import Credential from "../../util/Credential";
import {TownDashboardPageProcessor} from "../../processor/stateful/TownDashboardPageProcessor";

class TownDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (credential === undefined) return;
        RoleStateMachineManager.create()
            .inTown()
            .then(state => {
                const context = PageProcessorContext.whenInTown(state.townId);
                context.withRoleLevel(state.roleLevel);
                context.withRoleCareer(state.roleCareer);
                new TownDashboardPageProcessor(credential, context).process();
            });
    }

}

export = TownDashboardPageInterceptor;