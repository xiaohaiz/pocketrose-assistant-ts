import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {CountryCacheManagementPageProcessor} from "../../processor/stateful/CountryCacheManagementPageProcessor";

class CountryCacheManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("* 全员共通留言板 *");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (!credential) return;
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new CountryCacheManagementPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = CountryCacheManagementPageInterceptor;