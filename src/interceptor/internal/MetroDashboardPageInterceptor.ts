import LocationStateMachine from "../../core/state/LocationStateMachine";
import MetroDashboardPageProcessor from "../../processor/internal/MetroDashboardPageProcessor";
import PageInterceptor from "../PageInterceptor";

class MetroDashboardPageInterceptor implements PageInterceptor {

    readonly #processor = new MetroDashboardPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数") && pageText.includes("迪斯尼乐园");
        }
        return false;
    }

    intercept(): void {
        // Set current location state to METRO.
        LocationStateMachine.create().inMetro();
        this.#processor.process();
    }

}

export = MetroDashboardPageInterceptor;