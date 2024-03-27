import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CastlePostHousePageProcessor from "../../processor/internal/CastlePostHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class CastlePostHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜ * 机车建造厂 *＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInCastle(state => {
                        new CastlePostHousePageProcessor().process();
                    })
                    .process();
            });
    }

}

export = CastlePostHousePageInterceptor;