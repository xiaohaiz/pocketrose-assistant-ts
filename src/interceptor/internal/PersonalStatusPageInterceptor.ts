import LocationStateMachine from "../../core/state/LocationStateMachine";
import PersonalStatusPageProcessor_Castle from "../../processor/internal/PersonalStatusPageProcessor_Castle";
import PersonalStatusPageProcessor_Town from "../../processor/internal/PersonalStatusPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

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
            .whenInTown(townId => {
                const context = new PageProcessorContext();
                context.set("townId", townId!);
                this.#inTownProcessor.process(context);
            })
            .whenInCastle(() => {
                this.#inCastleProcessor.process();
            })
            .fork();
    }

}

export = PersonalStatusPageInterceptor;