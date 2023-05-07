import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalSetupPageProcessor_Castle from "../../processor/internal/PersonalSetupPageProcessor_Castle";

class PersonalSetupPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("给其他人发送消息");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInCastle(() => {
                new PersonalSetupPageProcessor_Castle().process();
            })
            .fork();
    }

}

export = PersonalSetupPageInterceptor;