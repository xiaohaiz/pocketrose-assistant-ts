import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {PersonalTeamPageProcessor} from "../../processor/stateful/PersonalTeamPageProcessor";

class PersonalTeamPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜ * 战斗时台词 *＞＞");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (credential === undefined) return;
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new PersonalTeamPageProcessor(credential, context).process();
                    })
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new PersonalTeamPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = PersonalTeamPageInterceptor;