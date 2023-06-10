import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownItemHousePageProcessor from "../../processor/internal/TownItemHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownItemHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownItemHousePageProcessor();

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
                        this.#processor.process();
                    })
                    .process();
            });
    }

}

export = TownItemHousePageInterceptor;