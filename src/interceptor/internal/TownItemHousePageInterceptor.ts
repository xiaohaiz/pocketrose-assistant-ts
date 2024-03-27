import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownItemHousePageProcessor from "../../processor/internal/TownItemHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownItemHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　物品屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new TownItemHousePageProcessor().process();
                    })
                    .process();
            });
    }

}

export = TownItemHousePageInterceptor;