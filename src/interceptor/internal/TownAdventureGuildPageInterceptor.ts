import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownAdventureGuildPageProcessor from "../../processor/internal/TownAdventureGuildPageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownAdventureGuildPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("*  藏宝图以旧换新业务 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        new TownAdventureGuildPageProcessor().process();
                    })
                    .process();
            });
    }

}

export = TownAdventureGuildPageInterceptor;