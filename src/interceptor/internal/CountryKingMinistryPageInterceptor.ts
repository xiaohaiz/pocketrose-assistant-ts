import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {CountryKingMinistryPageProcessor} from "../../processor/stateful/CountryKingMinistryPageProcessor";

class CountryKingMinistryPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("皇帝禅让和内阁任命");
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
                        new CountryKingMinistryPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = CountryKingMinistryPageInterceptor;