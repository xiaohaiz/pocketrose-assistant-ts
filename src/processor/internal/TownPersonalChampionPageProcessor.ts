import TownPersonalChampionPageParser from "../../core/champion/TownPersonalChampionPageParser";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPersonalChampionPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await new TownPersonalChampionPageParser().parse(PageUtils.currentPageHtml());

        processPersonalChampionPage();
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

}

function processPersonalChampionPage() {
    $("table:eq(1)")
        .find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  个 人 天 真  ＞＞");

    $("input:submit[value='返回城市']")
        .attr("id", "returnButton");
}

export = TownPersonalChampionPageProcessor;