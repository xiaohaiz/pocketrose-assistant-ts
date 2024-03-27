import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownArmorHousePageProcessor from "../../processor/internal/TownArmorHousePageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownArmorHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　防具屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new TownArmorHousePageProcessor().process();
                    })
                    .process();
            });
    }

}

export = TownArmorHousePageInterceptor;