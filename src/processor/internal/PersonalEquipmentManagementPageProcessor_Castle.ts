import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalEquipmentManagementPageProcessor_Castle extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());
    }

}

export = PersonalEquipmentManagementPageProcessor_Castle;