import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {TownAdventureGuildPageProcessor} from "../../processor/stateful/TownAdventureGuildPageProcessor";

class TownAdventureGuildPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("*  藏宝图以旧换新业务 *");
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
                        new TownAdventureGuildPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = TownAdventureGuildPageInterceptor;