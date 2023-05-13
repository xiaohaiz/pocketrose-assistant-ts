import PersonalPetManagement from "../../pocketrose/PersonalPetManagement";
import PersonalPetManagementPage from "../../pocketrose/PersonalPetManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalPetManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalPetManagement.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
    }

    #renderImmutablePage(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext) {
        this.doProcessWithPageParsed(credential, page, context);
    }

    abstract doProcessWithPageParsed(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext): void;
}

export = AbstractPersonalPetManagementPageProcessor;