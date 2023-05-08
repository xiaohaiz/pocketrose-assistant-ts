import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalCareerManagementProcessor from "../../processor/personal/PersonalCareerManagementProcessor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {
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
                new PersonalCareerManagementProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalCareerManagementProcessor().process();
            })
            .fork();
    }

}

export = PersonalCareerManagementPageInterceptor;