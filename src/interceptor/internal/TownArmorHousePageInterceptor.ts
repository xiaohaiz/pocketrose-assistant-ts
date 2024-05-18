import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {TownArmorHousePageProcessor} from "../../processor/stateful/TownArmorHousePageProcessor";

class TownArmorHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　防具屋　□　＞＞");
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
                        new TownArmorHousePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = TownArmorHousePageInterceptor;