import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {CastleDevelopmentPageProcessor} from "../../processor/stateful/CastleDevelopmentPageProcessor";

class CastleDevelopmentPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("* 城堡开发 *");
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
                    .whenInCastle(state => {
                        const context = PageProcessorContext.whenInCastle(state?.castleName);
                        new CastleDevelopmentPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export {CastleDevelopmentPageInterceptor};