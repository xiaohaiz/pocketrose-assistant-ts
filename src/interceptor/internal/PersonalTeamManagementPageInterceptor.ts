import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalTeamManagementPageProcessor from "../../processor/stateless/PersonalTeamManagementPageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalTeamManagementPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 出家 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new PersonalTeamManagementPageProcessor().process();
                    })
                    .process();
            });
    }

}

export = PersonalTeamManagementPageInterceptor;