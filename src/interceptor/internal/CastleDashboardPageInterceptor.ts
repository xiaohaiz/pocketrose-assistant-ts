import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {CastleDashboardPageProcessor} from "../../processor/stateful/CastleDashboardPageProcessor";

class CastleDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (!credential) return;
        RoleStateMachineManager.create()
            .inCastle()
            .then(state => {
                const context = PageProcessorContext.whenInCastle(state.castleName);
                new CastleDashboardPageProcessor(credential, context).process();
            });
    }

}

export = CastleDashboardPageInterceptor;