import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalStatusProcessor from "../../processor/personal/PersonalStatusProcessor";

class PersonalStatusPageInterceptor implements PageInterceptor {
    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                new PersonalStatusProcessor().process();
            })
            .whenInCastle(() => {
                new PersonalStatusProcessor().process();
            })
            .fork();
    }

}

export = PersonalStatusPageInterceptor;