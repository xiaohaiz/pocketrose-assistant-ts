import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";
import PageProcessorUtils from "../PageProcessorUtils";

class TownPetLeaguePageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        await this.#processPage(credential, context);
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    async #processPage(credential: Credential, context?: PageProcessorContext) {
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
            .text("＜＜  宠 物 联 赛 会 场  ＞＞");

        $("input:submit[value='返回城市']")
            .attr("id", "returnButton")
            .val(PageProcessorUtils.generateReturnTownButtonTitle(context) + "(Esc)");
    }
}

export = TownPetLeaguePageProcessor;