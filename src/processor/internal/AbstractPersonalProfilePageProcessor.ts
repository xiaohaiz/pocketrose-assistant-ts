import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalProfilePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
    }

}

export = AbstractPersonalProfilePageProcessor;