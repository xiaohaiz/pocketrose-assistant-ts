import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import {CountryChangePageProcessor} from "../../processor/stateful/CountryChangePageProcessor";

class CountryChangePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * 仕 官 和 下 野 *＞＞");
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
                        new CountryChangePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }


}

export = CountryChangePageInterceptor;