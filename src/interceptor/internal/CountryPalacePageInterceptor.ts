import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import {CountryPalacePageProcessor} from "../../processor/stateful/CountryPalacePageProcessor";

class CountryPalacePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * ") && pageText.includes("皇宫 *＞＞");
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
                        new CountryPalacePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = CountryPalacePageInterceptor;