import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownPostHouseProcessor from "../../processor/town/TownPostHouseProcessor";

class TownPostHousePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宿 屋 *");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new TownPostHouseProcessor().process();
            })
            .fork();
    }

}

export = TownPostHousePageInterceptor;