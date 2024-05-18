import PageInterceptor from "../PageInterceptor";
import Credential from "../../util/Credential";
import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PageProcessorContext from "../../processor/PageProcessorContext";
import {MapBuyCastlePageProcessor} from "../../processor/stateful/MapBuyCastlePageProcessor";

class MapBuyCastlePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("* 城堡购买 *");
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
                    .whenInMap(state => {
                        const context = PageProcessorContext.whenInMap(state?.asCoordinate())
                        new MapBuyCastlePageProcessor(credential, context).process();
                    })
                    .process();
            });
    }


}

export {MapBuyCastlePageInterceptor};