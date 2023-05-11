import Role from "../common/Role";
import RoleParser from "../pocket/RoleParser";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import PersonalStatusPage from "./PersonalStatusPage";

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

    async load(): Promise<Role> {
        const action = () => {
            return new Promise<Role>(resolve => {
                this.open().then(page => {
                    resolve(page.role!);
                });
            });
        };
        return await action();
    }
}

function doParsePage(pageHtml: string): PersonalStatusPage {
    const page = new PersonalStatusPage();
    page.role = RoleParser.parseRole(pageHtml);
    return page;
}

export = PersonalStatus;