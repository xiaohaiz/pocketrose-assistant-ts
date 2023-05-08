import PageProcessorSupport from "../PageProcessorSupport";
import PageProcessorContext from "../PageProcessorContext";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleBank from "../../pocketrose/CastleBank";

class CastleBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = CastleBank.parsePage(PageUtils.currentPageHtml());
    }

}

export = CastleBankPageProcessor;