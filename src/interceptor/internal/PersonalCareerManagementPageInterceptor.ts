import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalCareerManagementPageProcessor_Castle
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Castle";
import PersonalCareerManagementPageProcessor_Town
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import SetupLoader from "../../setup/SetupLoader";
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
                this.#inTownProcessor.process(PageProcessorContext.withTownId(townId));
            })
            .whenInCastle(castleName => {
                this.#inCastleProcessor.process(PageProcessorContext.withCastleName(castleName));
            })
            .fork();
    }

}

export = PersonalCareerManagementPageInterceptor;