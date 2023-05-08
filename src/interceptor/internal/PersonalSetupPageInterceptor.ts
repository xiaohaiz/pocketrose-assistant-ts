import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalSetupPageProcessor_Castle from "../../processor/internal/PersonalSetupPageProcessor_Castle";
import PersonalSetupPageProcessor_Town from "../../processor/internal/PersonalSetupPageProcessor_Town";

class PersonalSetupPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalSetupPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalSetupPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("给其他人发送消息");
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

export = PersonalSetupPageInterceptor;