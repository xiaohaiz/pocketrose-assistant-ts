import PageProcessorSupport from "../PageProcessorSupport";
import PageProcessorContext from "../PageProcessorContext";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleBank from "../../pocketrose/CastleBank";
import StringUtils from "../../util/StringUtils";

class CastleBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = CastleBank.parsePage(PageUtils.currentPageHtml());

        const castleName = context!.get("castleName")!;
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
            .text("＜＜  城 堡 银 行 " + StringUtils.toTitleString(castleName) + " 支 行  ＞＞");

    }

}

export = CastleBankPageProcessor;