import SetupLoader from "../../config/SetupLoader";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalPetManagementPageProcessor_Castle
    from "../../processor/internal/PersonalPetManagementPageProcessor_Castle";
import PersonalPetManagementPageProcessor_Town from "../../processor/internal/PersonalPetManagementPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalPetManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalPetManagementPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalPetManagementPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("宠物现在升级时学习新技能情况一览");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isPetManagementUIEnabled()) {
            return;
        }
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        this.#inTownProcessor.process(context);
                    })
                    .whenInCastle(state => {
                        const context = new PageProcessorContext();
                        context.withCastleName(state?.castleName);
                        this.#inCastleProcessor.process(context);
                    })
                    .process();
            });
    }

}

export = PersonalPetManagementPageInterceptor;