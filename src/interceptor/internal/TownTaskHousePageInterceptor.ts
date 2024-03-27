import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownTaskHousePageProcessor from "../../processor/internal/TownTaskHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownTaskHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 网 球 场 *＞＞");
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
                        new TownTaskHousePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = TownTaskHousePageInterceptor;