import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalStatusPageProcessor_Castle from "../../processor/internal/PersonalStatusPageProcessor_Castle";
import PersonalStatusPageProcessor_Town from "../../processor/internal/PersonalStatusPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalStatusPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
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
                        new PersonalStatusPageProcessor_Town().process(context);
                    })
                    .whenInCastle(() => {
                        new PersonalStatusPageProcessor_Castle().process();
                    })
                    .process();
            });
    }

}

export = PersonalStatusPageInterceptor;