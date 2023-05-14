import PersonalCareerManagement from "../../pocketrose/PersonalCareerManagement";
import PersonalCareerManagementPage from "../../pocketrose/PersonalCareerManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalCareerManagementPageProcessor extends PageProcessorCredentialSupport {


    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalCareerManagement.parsePage(PageUtils.currentPageHtml());
        this.doProcessPageParsed(credential, page, context);
    }

    abstract doProcessPageParsed(credential: Credential, page: PersonalCareerManagementPage, context?: PageProcessorContext): void;

}

export = AbstractPersonalCareerManagementPageProcessor;