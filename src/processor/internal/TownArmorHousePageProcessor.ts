import TownLoader from "../../core/TownLoader";
import TownArmorHouse from "../../pocketrose/TownArmorHouse";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownArmorHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownArmorHouse.parsePage(PageUtils.currentPageHtml());
        const town = TownLoader.getTownById(page.townId!)!;
    }

}

export = TownArmorHousePageProcessor;