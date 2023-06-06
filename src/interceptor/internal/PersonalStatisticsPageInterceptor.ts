import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalStatisticsPageProcessor_Castle from "../../processor/internal/PersonalStatisticsPageProcessor_Castle";
import PersonalStatisticsPageProcessor_Town from "../../processor/internal/PersonalStatisticsPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalStatisticsPageInterceptor implements PageInterceptor {

    readonly #inTownProcessor: PageProcessor = new PersonalStatisticsPageProcessor_Town();
    readonly #inCastleProcessor: PageProcessor = new PersonalStatisticsPageProcessor_Castle();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("点其他人测试其是否在挂机");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        this.#inTownProcessor.process();
                    })
                    .whenInCastle(() => {
                        this.#inCastleProcessor.process();
                    })
                    .process();
            });
    }

}

export = PersonalStatisticsPageInterceptor;