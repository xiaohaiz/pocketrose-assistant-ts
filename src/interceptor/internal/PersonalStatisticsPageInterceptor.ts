import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalStatisticsPageProcessor_Castle from "../../processor/stateless/PersonalStatisticsPageProcessor_Castle";
import PersonalStatisticsPageProcessor_Town from "../../processor/stateless/PersonalStatisticsPageProcessor_Town";
import PageInterceptor from "../PageInterceptor";

class PersonalStatisticsPageInterceptor implements PageInterceptor {

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
                        new PersonalStatisticsPageProcessor_Town().process();
                    })
                    .whenInCastle(() => {
                        new PersonalStatisticsPageProcessor_Castle().process();
                    })
                    .process();
            });
    }

}

export = PersonalStatisticsPageInterceptor;