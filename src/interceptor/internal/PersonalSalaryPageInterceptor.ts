import PageInterceptor from "../PageInterceptor";
import PersonalSalaryPageProcessor_Town from "../../processor/internal/PersonalSalaryPageProcessor_Town";
import LocationStateMachine from "../../core/LocationStateMachine";
import PageProcessorContext from "../../processor/PageProcessorContext";

class PersonalSalaryPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalSalaryPageProcessor_Town();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("领取了") || pageText.includes("下次领取俸禄还需要等待");
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
            .fork();
    }

}

export = PersonalSalaryPageInterceptor;