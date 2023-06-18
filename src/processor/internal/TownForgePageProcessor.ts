import TownForgePageParser from "../../core/forge/TownForgePageParser";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownForgePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await TownForgePageParser.parse(PageUtils.currentPageHtml());
    }

}

export = TownForgePageProcessor;