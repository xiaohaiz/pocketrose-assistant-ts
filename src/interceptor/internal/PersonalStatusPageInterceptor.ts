import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalStatusPageProcessor_Castle from "../../processor/internal/PersonalStatusPageProcessor_Castle";
import PersonalStatusPageProcessor_Town from "../../processor/internal/PersonalStatusPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalStatusPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalStatusPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalStatusPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        this.#inTownProcessor.process(context);
                    })
                    .whenInCastle(() => {
                        this.#inCastleProcessor.process();
                    })
                    .process();
            });
    }

}

export = PersonalStatusPageInterceptor;