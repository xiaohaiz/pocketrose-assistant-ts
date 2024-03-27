import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import TownForgePageProcessor from "../../processor/internal/TownForgePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownForgePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 锻 冶 屋 *＞＞");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(m => {
                m.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        new TownForgePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = TownForgePageInterceptor;