import LocationStateMachine from "../../core/LocationStateMachine";
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
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext()
                    .withTownId(townId);
                this.#processor.process(context);
            })
            .fork();
    }


}

export = PersonalManualPageInterceptor;