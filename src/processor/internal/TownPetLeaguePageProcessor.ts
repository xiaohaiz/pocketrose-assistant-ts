import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPetLeaguePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        processPetLeaguePage();
        PageUtils.onEscapePressed(() => $("#returnButton").trigger("click"));
    }

}

function processPetLeaguePage() {
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
        .attr("id", "returnButton");
}

export = TownPetLeaguePageProcessor;