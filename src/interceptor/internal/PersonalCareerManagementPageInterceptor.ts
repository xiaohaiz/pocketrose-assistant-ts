import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalCareerManagementPageProcessor_Castle
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Castle";
import PersonalCareerManagementPageProcessor_Town
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 转职神殿 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext()
                            .withTownId(state?.townId);
                        new PersonalCareerManagementPageProcessor_Town().process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext()
                            .withCastleName(state?.castleName);
                        new PersonalCareerManagementPageProcessor_Castle().process(context);
                    })
                    .process();
            });
    }

}

export = PersonalCareerManagementPageInterceptor;