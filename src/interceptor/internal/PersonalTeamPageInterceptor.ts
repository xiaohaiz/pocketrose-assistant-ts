import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalTeamPageProcessor_Castle from "../../processor/stateless/PersonalTeamPageProcessor_Castle";
import PersonalTeamPageProcessor_Town from "../../processor/stateless/PersonalTeamPageProcessor_Town";
import PageInterceptor from "../PageInterceptor";

class PersonalTeamPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜ * 战斗时台词 *＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new PersonalTeamPageProcessor_Town().process();
                    })
                    .whenInCastle(() => {
                        new PersonalTeamPageProcessor_Castle().process();
                    })
                    .process();
            });
    }

}

export = PersonalTeamPageInterceptor;