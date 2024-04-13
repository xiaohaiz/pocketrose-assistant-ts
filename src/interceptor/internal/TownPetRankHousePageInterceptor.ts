import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPetRankHousePageProcessor from "../../processor/stateless/TownPetRankHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownPetRankHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 宠物资料馆 *＞＞");
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
                        new TownPetRankHousePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = TownPetRankHousePageInterceptor;