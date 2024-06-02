import PageInterceptor from "../PageInterceptor";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import Credential from "../../util/Credential";
import {TownEquipmentProfilePageProcessor} from "../../processor/stateful/TownEquipmentProfilePageProcessor";

class TownEquipmentProfilePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 自制装备 *");
        }
        return false;
    }

    intercept(): void {
        const credential = Credential.newInstance();
        if (!credential) return;
        RoleStateMachineManager.create()
            .load()
            .then(m => {
                m.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new TownEquipmentProfilePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }


}

export {TownEquipmentProfilePageInterceptor};