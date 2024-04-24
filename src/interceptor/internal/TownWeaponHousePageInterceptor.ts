import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownWeaponHousePageProcessor from "../../processor/stateless/TownWeaponHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownWeaponHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　武器屋　□　＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId);
                        new TownWeaponHousePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = TownWeaponHousePageInterceptor;