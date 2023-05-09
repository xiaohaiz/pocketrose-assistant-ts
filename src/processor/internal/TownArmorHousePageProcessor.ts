import Town from "../../core/Town";
import TownLoader from "../../core/TownLoader";
import TownArmorHouse from "../../pocketrose/TownArmorHouse";
import TownArmorHousePage from "../../pocketrose/TownArmorHousePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownArmorHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownArmorHouse.parsePage(PageUtils.currentPageHtml());
        const town = TownLoader.getTownById(page.townId!)!;
        this.#renderImmutablePage(credential, town);
        this.#renderMutablePage(credential, page, town);
    }

    #renderImmutablePage(credential: Credential, town: Town) {
    }

    #renderMutablePage(credential: Credential, page: TownArmorHousePage, town: Town) {
    }
}

export = TownArmorHousePageProcessor;