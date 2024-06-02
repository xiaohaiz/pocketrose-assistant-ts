import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import Credential from "../../util/Credential";
import {MetroDashboardPageProcessor} from "../../processor/stateful/MetroDashboardPageProcessor";

class MetroDashboardPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数") && pageText.includes("迪斯尼乐园");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (!credential) return;
        RoleStateMachineManager.create()
            .inMetro()
            .then(() => {
                const context = PageProcessorContext.whenInMetro();
                new MetroDashboardPageProcessor(credential, context).process();
            });
    }

}

export = MetroDashboardPageInterceptor;