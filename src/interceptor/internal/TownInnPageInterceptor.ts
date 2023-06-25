import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownInnPageProcessor from "../../processor/internal/TownInnPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownInnPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new TownInnPageProcessor();

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

export = TownInnPageInterceptor;