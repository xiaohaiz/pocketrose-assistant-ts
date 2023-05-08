import TownLoader from "../../core/TownLoader";
import Town from "../../pocket/Town";
import TownBank from "../../pocketrose/TownBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorSupport from "../PageProcessorSupport";

class TownBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownBank.parsePage(PageUtils.currentPageHtml());
        const town = TownLoader.getTownById(context!.get("townId")!)!;

        this.#createImmutablePage(credential, town);
    }

    #createImmutablePage(credential: Credential, town: Town) {
    }
}

export = TownBankPageProcessor;