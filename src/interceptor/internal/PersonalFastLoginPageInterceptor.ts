import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../core/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalFastLoginPageProcessor from "../../processor/internal/PersonalFastLoginPageProcessor";

class PersonalFastLoginPageInterceptor implements PageInterceptor {

    readonly #processor = new PersonalFastLoginPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 出家 *");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isFastLoginEnabled()) {
            return;
        }
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = PersonalFastLoginPageInterceptor;