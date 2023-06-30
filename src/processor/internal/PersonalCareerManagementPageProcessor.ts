import PersonalCareerManagement from "../../core/career/PersonalCareerManagement";
import PersonalCareerManagementPage from "../../core/career/PersonalCareerManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalCareerManagementPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = PersonalCareerManagement.parsePage(PageUtils.currentPageHtml());
        this.doProcessPageParsed(credential, page, context);
        PageUtils.onDoubleEscape(() => $("#returnButton").trigger("click"));
    }

    abstract doProcessPageParsed(credential: Credential, page: PersonalCareerManagementPage, context?: PageProcessorContext): void;

}

export = PersonalCareerManagementPageProcessor;