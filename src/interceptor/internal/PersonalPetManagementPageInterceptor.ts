import PageInterceptor from "../PageInterceptor";
import SetupLoader from "../../core/SetupLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalPetManagementPageProcessor from "../../processor/internal/PersonalPetManagementPageProcessor";

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
        LocationStateMachine.create()
            .load()
            .whenInTown(() => {
                new PersonalPetManagementPageProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalPetManagementPageProcessor().process();
            })
            .fork();
    }

}

export = PersonalPetManagementPageInterceptor;