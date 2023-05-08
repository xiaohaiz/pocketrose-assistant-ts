import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalStatusPageProcessor_Town from "../../processor/internal/PersonalStatusPageProcessor_Town";
import PersonalStatusPageProcessor_Castle from "../../processor/internal/PersonalStatusPageProcessor_Castle";

class PersonalStatusPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalStatusPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalStatusPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
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

export = PersonalStatusPageInterceptor;