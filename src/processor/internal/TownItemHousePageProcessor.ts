import TownItemHouse from "../../pocketrose/TownItemHouse";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownItemHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownItemHouse.parsePage(PageUtils.currentPageHtml());
    }

}

export = TownItemHousePageProcessor;