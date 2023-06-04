import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalTeamPageProcessor_Castle from "../../processor/internal/PersonalTeamPageProcessor_Castle";
import PersonalTeamPageProcessor_Town from "../../processor/internal/PersonalTeamPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalTeamPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalTeamPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalTeamPageProcessor_Castle();

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
                        this.#inTownProcessor.process();
                    })
                    .whenInCastle(() => {
                        this.#inCastleProcessor.process();
                    })
                    .process();
            });
    }

}

export = PersonalTeamPageInterceptor;