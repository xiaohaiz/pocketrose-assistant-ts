import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalSetupPageProcessor_Castle from "../../processor/internal/PersonalSetupPageProcessor_Castle";
import PersonalSetupPageProcessor_Town from "../../processor/internal/PersonalSetupPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalSetupPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalSetupPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalSetupPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("给其他人发送消息");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        this.#inTownProcessor.process();
                    })
                    .whenInCastle(() => {
                        this.#inCastleProcessor.process();
                    })
                    .process();
            });
    }

}

export = PersonalSetupPageInterceptor;