import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PersonalStatusPage from "./PersonalStatusPage";
import RoleParser from "./RoleParser";

class PersonalStatus {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string): PersonalStatusPage {
        return doParsePage(pageHtml);
    }
}

function doParsePage(pageHtml: string): PersonalStatusPage {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new PersonalStatusPage(credential);
    page.role = RoleParser.parseRole(pageHtml);
    return page;
}

export = PersonalStatus;