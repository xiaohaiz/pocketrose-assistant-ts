import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownInnPageProcessor from "../../processor/stateless/TownInnPageProcessor";
import PageInterceptor from "../PageInterceptor";

class TownInnPageInterceptor implements PageInterceptor {

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
                        new TownInnPageProcessor().process();
                    })
                    .process();
            });
    }

}

export = TownInnPageInterceptor;