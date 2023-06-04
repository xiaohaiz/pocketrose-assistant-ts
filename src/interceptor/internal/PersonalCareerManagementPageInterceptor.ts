import SetupLoader from "../../config/SetupLoader";
import LocationStateMachine from "../../core/state/LocationStateMachine";
import PersonalCareerManagementPageProcessor_Castle
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Castle";
import PersonalCareerManagementPageProcessor_Town
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalCareerManagementPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalCareerManagementPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 转职神殿 *");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isCareerManagementUIEnabled()) {
            return;
        }
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext()
                    .withTownId(townId);
                this.#inTownProcessor.process(context);
            })
            .whenInCastle(castleName => {
                const context = new PageProcessorContext()
                    .withCastleName(castleName);
                this.#inCastleProcessor.process(context);
            })
            .fork();
    }

}

export = PersonalCareerManagementPageInterceptor;