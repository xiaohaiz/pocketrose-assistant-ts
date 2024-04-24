import PageInterceptor from "../PageInterceptor";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import Credential from "../../util/Credential";
import {TownSpecialPetHousePageProcessor} from "../../processor/stateful/TownSpecialPetHousePageProcessor";

class TownSpecialPetHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 自制装备 *");
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
                        new TownSpecialPetHousePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export {TownSpecialPetHousePageInterceptor};