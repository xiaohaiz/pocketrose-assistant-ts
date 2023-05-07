import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownAdventureGuildProcessor from "../../processor/town/TownAdventureGuildProcessor";

class TownAdventureGuildPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("*  藏宝图以旧换新业务 *");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new TownAdventureGuildProcessor().process();
            })
            .fork();
    }

}

export = TownAdventureGuildPageInterceptor;