import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PersonalPetManagementPageProcessor from "../../processor/stateful/PersonalPetManagementPageProcessor";

class PersonalPetManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("宠物现在升级时学习新技能情况一览");
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
                        new PersonalPetManagementPageProcessor(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalPetManagementPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = PersonalPetManagementPageInterceptor;