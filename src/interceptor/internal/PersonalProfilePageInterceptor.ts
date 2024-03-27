import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalProfilePageProcessor_Castle from "../../processor/internal/PersonalProfilePageProcessor_Castle";
import PersonalProfilePageProcessor_Town from "../../processor/internal/PersonalProfilePageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalProfilePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("已经把您的数据更新了");
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
                        new PersonalProfilePageProcessor_Town().process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext()
                            .withCastleName(state?.castleName);
                        new PersonalProfilePageProcessor_Castle().process(context);
                    })
                    .process();
            });
    }
}

export = PersonalProfilePageInterceptor;