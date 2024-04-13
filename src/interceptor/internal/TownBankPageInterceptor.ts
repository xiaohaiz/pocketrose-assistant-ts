import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {TownBankPageProcessor} from "../../processor/stateful/TownBankPageProcessor";

class TownBankPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
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
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        context.withBattleCount(state?.battleCount?.toString());
                        new TownBankPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = TownBankPageInterceptor;