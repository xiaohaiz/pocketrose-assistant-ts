import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalStatisticsPageProcessor_Town from "../../processor/internal/PersonalStatisticsPageProcessor_Town";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalStatisticsPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new PersonalStatisticsPageProcessor_Town();

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
                        this.#processor.process();
                    })
                    .process();
            });
    }

}

export = PersonalStatisticsPageInterceptor;