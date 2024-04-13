import _ from "lodash";
import Credential from "../../util/Credential";
import PageInterceptor from "../PageInterceptor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import {TownCastleHousekeeperPageProcessor} from "../../processor/stateful/TownCastleHousekeeperPageProcessor";

class TownCastleHousekeeperPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return _.includes(pageText, "＜＜　□　 物 品 拍 卖 场 　□　＞＞");
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
                        new TownCastleHousekeeperPageProcessor(credential, context).process();
                    })
                    .process();
            });
    }

}

export {TownCastleHousekeeperPageInterceptor};