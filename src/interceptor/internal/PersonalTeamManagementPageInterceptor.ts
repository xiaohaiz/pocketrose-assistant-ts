import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalTeamManagementPageProcessor from "../../processor/internal/PersonalTeamManagementPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalTeamManagementPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new PersonalTeamManagementPageProcessor();

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
                        this.#processor.process();
                    })
                    .process();
            });
    }

}

export = PersonalTeamManagementPageInterceptor;