import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import {PersonalStatusPageProcessor} from "../../processor/stateful/PersonalStatusPageProcessor";

class PersonalStatusPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (credential === undefined) return;
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new PersonalStatusPageProcessor(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalStatusPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = PersonalStatusPageInterceptor;