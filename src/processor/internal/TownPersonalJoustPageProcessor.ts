import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPersonalJoustPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        processPersonalJoustPage();
        PageUtils.onEscapePressed(() => $("#returnButton").trigger("click"));
    }

}

function processPersonalJoustPage() {
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

export = TownPersonalJoustPageProcessor;