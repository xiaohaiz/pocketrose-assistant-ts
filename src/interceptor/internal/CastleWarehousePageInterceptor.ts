import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleWarehousePageProcessor from "../../processor/internal/CastleWarehousePageProcessor";

class CastleWarehousePageInterceptor implements PageInterceptor {

    readonly #processor = new CastleWarehousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡仓库　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInCastle(() => {
                this.#processor.process();
            })
            .fork();
    }


}

export = CastleWarehousePageInterceptor;