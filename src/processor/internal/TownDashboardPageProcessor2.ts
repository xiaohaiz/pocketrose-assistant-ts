import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import RankTitleLoader from "../../core/RankTitleLoader";
import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownDashboardPageProcessor2 extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownDashboardPage.parse(PageUtils.currentPageHtml());

        $("center:first")
            .attr("id", "systemAnnouncement")
            .each((idx, center) => {
                const id = $(center).attr("id")!;
                // 手机战斗返回后不在页面顶端，尝试自动触顶。
                PageUtils.scrollIntoView(id);
                $(center).after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
                // @ts-ignore
                $("#version").html(__VERSION__);
            });

        doMarkElement();
        doRenderMobilization();
    }

}

function doMarkElement() {
    $("input:text:last").attr("id", "messageInputText");
    $("input:submit[value='更新']").attr("id", "refreshButton");
    $("table:first")
        .find("> tbody:first")
        .find("> tr:eq(1)")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .attr("id", "mobilization")
        .parent()
        .parent()
        .find("> tr:eq(1)")
        .find("> td:first")
        .attr("id", "leftPanel")
        .next()
        .attr("id", "rightPanel");

}

function doRenderMobilization() {
    $("#mobilization")
        .find("> form:first")
        .find("> font:first")
        .each((idx, font) => {
            let c = $(font).text();
            let b = StringUtils.substringAfterLast(c, "(");
            let a = StringUtils.substringBefore(c, "(" + b);
            b = StringUtils.substringBefore(b, ")");
            const ss = _.split(b, " ");
            const b1 = _.replace(ss[0], "部队", "");
            const b2 = SetupLoader.isQiHanTitleEnabled() ? RankTitleLoader.transformTitle(ss[1]) : ss[1];
            const b3 = ss[2];
            const s = a + "(" + b1 + " " + b2 + " " + b3 + ")";
            $(font).text(s);
        });
}

export = TownDashboardPageProcessor2;