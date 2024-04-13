import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownAccessoryHousePageProcessor from "../../processor/stateless/TownAccessoryHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownAccessoryHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　饰品屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new TownAccessoryHousePageProcessor().process();
                    })
                    .process();
            });
    }

}

export = TownAccessoryHousePageInterceptor;