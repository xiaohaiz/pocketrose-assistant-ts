import PersonalPetManagement from "../../pocketrose/PersonalPetManagement";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalPetManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalPetManagement.parsePage(PageUtils.currentPageHtml());
    }

}

export = AbstractPersonalPetManagementPageProcessor;