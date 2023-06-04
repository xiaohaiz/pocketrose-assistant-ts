import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalManualPageProcessor from "../../processor/internal/PersonalManualPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalManualPageInterceptor implements PageInterceptor {

    readonly #processor = new PersonalManualPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜ * 成立新国家 *＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext()
                            .withTownId(state?.townId);
                        this.#processor.process(context);
                    })
                    .process();
            });
    }


}

export = PersonalManualPageInterceptor;