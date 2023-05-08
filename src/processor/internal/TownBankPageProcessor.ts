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
        $("form").remove();

        $("table:eq(1)")
            .attr("id", "t1")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  口 袋 银 行 " + town.nameTitle + " 分 行  ＞＞");
    }
}

export = TownBankPageProcessor;