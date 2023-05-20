import LocationStateMachine from "../../core/LocationStateMachine";
import PersonalCareerManagementPageProcessor_Town
    from "../../processor/internal/PersonalCareerManagementPageProcessor_Town";
import SetupLoader from "../../setup/SetupLoader";
import PageInterceptor from "../PageInterceptor";

class PersonalCareerManagementPageInterceptor implements PageInterceptor {

    readonly #processor = new PersonalCareerManagementPageProcessor_Town();

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
        LocationStateMachine.create()
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