import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import TownAdventureGuildPageProcessor from "../../processor/internal/TownAdventureGuildPageProcessor";

class TownAdventureGuildPageInterceptor implements PageInterceptor {

    readonly #processor = new TownAdventureGuildPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("*  藏宝图以旧换新业务 *");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = TownAdventureGuildPageInterceptor;