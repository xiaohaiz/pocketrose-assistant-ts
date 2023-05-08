import Credential from "../../util/Credential";
import PageProcessorSupport from "../PageProcessorSupport";
import PageProcessorContext from "../PageProcessorContext";

abstract class AbstractPersonalPetManagementPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
    }

}

export = AbstractPersonalPetManagementPageProcessor;