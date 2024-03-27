import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalPetManagementPageProcessor_Castle
    from "../../processor/internal/PersonalPetManagementPageProcessor_Castle";
import PersonalPetManagementPageProcessor_Town from "../../processor/internal/PersonalPetManagementPageProcessor_Town";
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
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        new PersonalPetManagementPageProcessor_Town().process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext();
                        context.withCastleName(state?.castleName);
                        new PersonalPetManagementPageProcessor_Castle().process(context);
                    })
                    .process();
            });
    }

}

export = PersonalPetManagementPageInterceptor;