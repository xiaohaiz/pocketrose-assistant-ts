import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
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
        RoleStateMachineManager.create()
            .inMap()
            .then(state => {
                const context = new PageProcessorContext();
                context.set("coordinate", state.asCoordinate()?.asText());
                this.#processor.process(context);
            });
    }


}

export = MapDashboardPageInterceptor;