import LocationStateMachine from "../../core/LocationStateMachine";
import SetupLoader from "../../core/SetupLoader";
import PersonalPetManagementPageProcessor_Castle
    from "../../processor/internal/PersonalPetManagementPageProcessor_Castle";
import PersonalPetManagementPageProcessor_Town from "../../processor/internal/PersonalPetManagementPageProcessor_Town";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalPetManagementPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor = new PersonalPetManagementPageProcessor_Town();
    readonly #inCastleProcessor = new PersonalPetManagementPageProcessor_Castle();

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
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext();
                context.set("townId", townId!);
                this.#inTownProcessor.process(context);
            })
            .whenInCastle(castleName => {
                const context = new PageProcessorContext();
                context.set("castleName", castleName!);
                this.#inCastleProcessor.process(context);
            })
            .fork();
    }

}

export = PersonalPetManagementPageInterceptor;