import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalCareerManagementPageProcessor_Castle
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Castle";
import PersonalCareerManagementPageProcessor_Town
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalCareerManagementPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalCareerManagementPageProcessor_Castle();

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
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext()
                            .withTownId(state?.townId);
                        this.#inTownProcessor.process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext()
                            .withCastleName(state?.castleName);
                        this.#inCastleProcessor.process(context);
                    })
                    .process();
            });
    }

}

export = PersonalCareerManagementPageInterceptor;