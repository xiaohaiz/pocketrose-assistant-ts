import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PersonalStatusPage from "./PersonalStatusPage";
import RoleParser from "./RoleParser";
import NetworkUtils from "../util/NetworkUtils";

class PersonalStatus {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string): PersonalStatusPage {
        return doParsePage(pageHtml);
    }

    async open(): Promise<PersonalStatusPage> {
        const action = (credential: Credential) => {
            return new Promise<PersonalStatusPage>(resolve => {
                const request = credential.asRequestMap();
                request.set("mode", "STATUS_PRINT");
                NetworkUtils.post("mydata.cgi", request)
                    .then(pageHtml => {
                        const page = PersonalStatus.parsePage(pageHtml);
                        resolve(page);
                    });
            });
        };
        return await action(this.#credential);
    }
}

function doParsePage(pageHtml: string): PersonalStatusPage {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new PersonalStatusPage(credential);
    page.role = RoleParser.parseRole(pageHtml);
    return page;
}

export = PersonalStatus;