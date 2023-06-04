import LocationStateMachine from "../../core/state/LocationStateMachine";
import RoleStateMachine from "../../core/state/RoleStateMachine";
import MapDashboardPageProcessor from "../../processor/internal/MapDashboardPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class MapDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new MapDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数") && !pageText.includes("迪斯尼乐园");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachine.create()
            .inMap()
            .then(() => {
                LocationStateMachine.create().inMap();
                LocationStateMachine.create()
                    .load()
                    .whenInMap(coordinate => {
                        const context = new PageProcessorContext();
                        context.set("coordinate", coordinate!.asText());
                        this.#processor.process(context);
                    })
                    .fork();
            });
    }


}

export = MapDashboardPageInterceptor;