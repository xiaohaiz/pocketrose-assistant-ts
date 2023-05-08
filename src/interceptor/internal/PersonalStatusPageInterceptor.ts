import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalStatusProcessor from "../../processor/personal/PersonalStatusProcessor";
import PersonalStatusPageProcessor_Town from "../../processor/internal/PersonalStatusPageProcessor_Town";

class PersonalStatusPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalStatusPageProcessor_Town();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                this.#inTownProcessor.process();
            })
            .whenInCastle(() => {
                new PersonalStatusProcessor().process();
            })
            .fork();
    }

}

export = PersonalStatusPageInterceptor;