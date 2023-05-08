import PageProcessorSupport from "../PageProcessorSupport";
import PageProcessorContext from "../PageProcessorContext";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";

class CastleBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        console.log(PageUtils.currentPageHtml());
    }

}

export = CastleBankPageProcessor;