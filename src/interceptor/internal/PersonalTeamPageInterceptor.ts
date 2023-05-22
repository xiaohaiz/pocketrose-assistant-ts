import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalTeamPageProcessor_Castle from "../../processor/internal/PersonalTeamPageProcessor_Castle";
import PersonalTeamPageProcessor_Town from "../../processor/internal/PersonalTeamPageProcessor_Town";
import PageInterceptor from "../PageInterceptor";

class PersonalTeamPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalTeamPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalTeamPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜ * 战斗时台词 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(() => {
                this.#inTownProcessor.process();
            })
            .whenInCastle(() => {
                this.#inCastleProcessor.process();
            })
            .fork();
    }

}

export = PersonalTeamPageInterceptor;