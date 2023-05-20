import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalProfilePageProcessor_Castle from "../../processor/internal/PersonalProfilePageProcessor_Castle";
import PersonalProfilePageProcessor_Town from "../../processor/internal/PersonalProfilePageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalProfilePageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalProfilePageProcessor_Town();
    readonly #inCastleProcessor = new PersonalProfilePageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("已经把您的数据更新了");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                this.#inTownProcessor.process(PageProcessorContext.withTownId(townId));
            })
            .whenInCastle(castleName => {
                this.#inCastleProcessor.process(PageProcessorContext.withCastleName(castleName));
            })
            .fork();
    }
}

export = PersonalProfilePageInterceptor;