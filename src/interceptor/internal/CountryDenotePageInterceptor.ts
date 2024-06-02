import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import {CountryDenotePageProcessor} from "../../processor/stateful/CountryDenotePageProcessor";

class CountryDenotePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("* 资 金 援 助 *");
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
                        new CountryDenotePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }


}

export = CountryDenotePageInterceptor;