import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalFastLoginProcessor from "../../processor/personal/PersonalFastLoginProcessor";

class PersonalFastLoginPageInterceptor implements PageInterceptor {
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
                new PersonalFastLoginProcessor().process();
            })
            .fork();
    }

}

export = PersonalFastLoginPageInterceptor;