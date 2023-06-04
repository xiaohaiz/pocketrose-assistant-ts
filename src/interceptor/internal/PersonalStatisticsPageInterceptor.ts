import LocationStateMachine from "../../core/state/LocationStateMachine";
import PersonalStatisticsPageProcessor from "../../processor/internal/PersonalStatisticsPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class PersonalStatisticsPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new PersonalStatisticsPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("点其他人测试其是否在挂机");
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

export = PersonalStatisticsPageInterceptor;