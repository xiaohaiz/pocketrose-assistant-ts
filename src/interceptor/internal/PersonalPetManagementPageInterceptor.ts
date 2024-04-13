import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import PersonalPetManagementPageProcessorTownImpl
    from "../../processor/stateful/PersonalPetManagementPageProcessorTownImpl";
import Credential from "../../util/Credential";
import PersonalPetManagementPageProcessorCastleImpl
    from "../../processor/stateful/PersonalPetManagementPageProcessorCastleImpl";

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
                        new PersonalPetManagementPageProcessorTownImpl(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalPetManagementPageProcessorCastleImpl(credential, context).process();
                    })
                    .process();
            });
    }

}

export = PersonalPetManagementPageInterceptor;