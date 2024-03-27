import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalSetupPageProcessor_Castle from "../../processor/internal/PersonalSetupPageProcessor_Castle";
import PersonalSetupPageProcessor_Town from "../../processor/internal/PersonalSetupPageProcessor_Town";
import PageInterceptor from "../PageInterceptor";

class PersonalSetupPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("给其他人发送消息");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new PersonalSetupPageProcessor_Town().process();
                    })
                    .whenInCastle(() => {
                        new PersonalSetupPageProcessor_Castle().process();
                    })
                    .process();
            });
    }

}

export = PersonalSetupPageInterceptor;