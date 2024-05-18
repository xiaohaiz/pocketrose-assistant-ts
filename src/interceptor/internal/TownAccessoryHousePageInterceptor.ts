import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {TownAccessoryHousePageProcessor} from "../../processor/stateful/TownAccessoryHousePageProcessor";

class TownAccessoryHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　饰品屋　□　＞＞");
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
                        new TownAccessoryHousePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export = TownAccessoryHousePageInterceptor;