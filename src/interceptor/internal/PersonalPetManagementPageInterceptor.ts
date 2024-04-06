import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalPetManagementPageProcessorCastleImpl
    from "../../processor/stateless/PersonalPetManagementPageProcessorCastleImpl";
import PersonalPetManagementPageProcessorTownImpl
    from "../../processor/stateless/PersonalPetManagementPageProcessorTownImpl";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalPetManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("宠物现在升级时学习新技能情况一览");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new PersonalPetManagementPageProcessorTownImpl().process(context);
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalPetManagementPageProcessorCastleImpl().process(context);
                    })
                    .process();
            });
    }

}

export = PersonalPetManagementPageInterceptor;