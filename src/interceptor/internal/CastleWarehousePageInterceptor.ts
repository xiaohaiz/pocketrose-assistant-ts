import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import CastleWareHouseProcessor from "../../processor/castle/CastleWareHouseProcessor";

class CastleWarehousePageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡仓库　|||　＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInCastle(() => {
                new CastleWareHouseProcessor().process();
            })
            .fork();
    }


}

export = CastleWarehousePageInterceptor;