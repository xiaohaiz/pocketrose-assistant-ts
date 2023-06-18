import PageProcessorContext from "../../processor/PageProcessorContext";
import PageProcessorCredentialSupport from "../../processor/PageProcessorCredentialSupport";
import Credential from "../../util/Credential";

class TownForgePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
    }

}

export = TownForgePageProcessor;