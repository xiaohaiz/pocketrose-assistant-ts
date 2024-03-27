import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPetLeaguePageProcessor from "../../processor/internal/TownPetLeaguePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownPetLeaguePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("宠物联赛 　 会场");
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
                        new TownPetLeaguePageProcessor().process(context);
                    })
                    .process();
            });
    }


}

export = TownPetLeaguePageInterceptor;