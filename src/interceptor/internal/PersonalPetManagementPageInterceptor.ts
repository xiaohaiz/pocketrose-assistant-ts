import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../pocket/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalPetManagementProcessor from "../../processor/personal/PersonalPetManagementProcessor";

class PersonalPetManagementPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("宠物现在升级时学习新技能情况一览");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isPetManagementUIEnabled()) {
            return;
        }
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new PersonalPetManagementProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalPetManagementProcessor().process();
            })
            .fork();
    }

}

export = PersonalPetManagementPageInterceptor;