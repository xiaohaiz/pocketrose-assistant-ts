import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PersonalProfilePageProcessor from "../../processor/stateful/PersonalProfilePageProcessor";

class PersonalProfilePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("已经把您的数据更新了");
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
                        new PersonalProfilePageProcessor(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalProfilePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }
}

export = PersonalProfilePageInterceptor;