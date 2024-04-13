import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {CastleBankPageProcessor} from "../../processor/stateful/CastleBankPageProcessor";

class CastleBankPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("存入或取出请输入数额后按下确认键");
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
                        new CastleBankPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = CastleBankPageInterceptor;