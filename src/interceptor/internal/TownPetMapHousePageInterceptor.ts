import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPetMapHousePageProcessor from "../../processor/internal/TownPetMapHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownPetMapHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宠物图鉴 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        new TownPetMapHousePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = TownPetMapHousePageInterceptor;