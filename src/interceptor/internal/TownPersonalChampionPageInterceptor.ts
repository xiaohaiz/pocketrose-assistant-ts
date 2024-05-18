import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import {TownPersonalChampionPageProcessor} from "../../processor/stateful/TownPersonalChampionPageProcessor";

class TownPersonalChampionPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("个人天真 　 会场");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (!credential) return;
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new TownPersonalChampionPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = TownPersonalChampionPageInterceptor;