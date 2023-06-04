import LocationStateMachine from "../../core/state/LocationStateMachine";
import TownPetMapHousePageProcessor from "../../processor/internal/TownPetMapHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownPetMapHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownPetMapHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宠物图鉴 *");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext();
                context.set("townId", townId!);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = TownPetMapHousePageInterceptor;