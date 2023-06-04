import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownPostHousePageProcessor from "../../processor/internal/TownPostHousePageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownPostHousePageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownPostHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宿 屋 *");
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

export = TownPostHousePageInterceptor;