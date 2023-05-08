import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalCareerManagementPageProcessor from "../../processor/internal/PersonalCareerManagementPageProcessor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {

    readonly #processor = new PersonalCareerManagementPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 转职神殿 *");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isCareerManagementUIEnabled()) {
            return;
        }
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .whenInCastle(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = PersonalCareerManagementPageInterceptor;