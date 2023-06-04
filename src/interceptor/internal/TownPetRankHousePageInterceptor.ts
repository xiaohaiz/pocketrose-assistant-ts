import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPetRankHousePageProcessor from "../../processor/internal/TownPetRankHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownPetRankHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownPetRankHousePageProcessor();

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
                    .whenInTown(() => {
                        this.#processor.process();
                    })
                    .process();
            });
    }

}

export = TownPetRankHousePageInterceptor;