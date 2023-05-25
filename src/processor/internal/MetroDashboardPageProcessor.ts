import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import EventHandler from "../../core/EventHandler";
import RankTitleLoader from "../../core/RankTitleLoader";
import MetroDashboardPage from "../../pocketrose/MetroDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class MetroDashboardPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = MetroDashboardPage.parse(PageUtils.currentPageHtml());

        // --------------------------------------------------------------------
        // 系统公告
        // --------------------------------------------------------------------
        $("center:first")
            .attr("id", "systemAnnouncement");
        $("#systemAnnouncement")
            .after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
        // @ts-ignore
        $("#version").html(__VERSION__);

        // --------------------------------------------------------------------
        // 国家动员指令
        // --------------------------------------------------------------------
        if (SetupLoader.isQiHanTitleEnabled()) {
            $("table:first")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> td:first")
                .find("> form:first")
                .find("> font:first")
                .each((idx, font) => {
                    let c = $(font).text();

                    let b = StringUtils.substringAfterLast(c, "(");
                    let a = StringUtils.substringBefore(c, "(" + b);
                    b = StringUtils.substringBefore(b, ")");
                    const ss = _.split(b, " ");
                    const b1 = _.replace(ss[0], "部队", "");
                    const b2 = RankTitleLoader.transformTitle(ss[1]);
                    const b3 = ss[2];

                    const s = a + "(" + b1 + " " + b2 + " " + b3 + ")";
                    $(font).text(s);
                });
        }

        // --------------------------------------------------------------------
        // 身份
        // --------------------------------------------------------------------
        if (SetupLoader.isQiHanTitleEnabled()) {
            $("td:contains('身份')")
                .filter((idx, td) => $(td).text() === "身份")
                .next()
                .each((idx, th) => {
                    let c = $(th).text();
                    c = RankTitleLoader.transformTitle(c);
                    $(th).text(c);
                });
        }

        // --------------------------------------------------------------------
        // 经验值
        // --------------------------------------------------------------------
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            $("td:contains('经验值')")
                .filter(function () {
                    return $(this).text() === "经验值";
                })
                .next()
                .each(function (_idx, th) {
                    const expText = $(th).text();
                    const experience = parseInt(StringUtils.substringBefore(expText, " EX"));
                    if (experience >= 14900) {
                        $(th).css("color", "blue").text("MAX");
                    } else {
                        const level = Math.ceil(experience / 100) + 1;
                        const ratio = level / 150;
                        const progressBar = PageUtils.generateProgressBarHTML(ratio);
                        $(th).html("<span title='" + expText + "'>" + progressBar + "</span>");
                    }
                });
        }

        renderEventBoard();
    }


}

function renderEventBoard() {
    $("td:contains('最近发生的事件')")
        .filter(function () {
            return $(this).text() === "最近发生的事件";
        })
        .parent()
        .next()
        .find("td:first")
        .attr("id", "eventBoard");

    const eventHtmlList: string[] = [];
    $("#eventBoard").html()
        .split("<br>")
        .filter(it => it.endsWith(")"))
        .map(function (it) {
            // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
            const header: string = "<font color=\"navy\">●</font>";
            return StringUtils.substringAfter(it, header);
        })
        .map(function (it) {
            return EventHandler.handleWithEventHtml(it);
        })
        .forEach(it => eventHtmlList.push(it));

    let html = "";
    html += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
    html += "<tbody>";
    eventHtmlList.forEach(it => {
        html += "<tr>";
        html += "<th style='color:navy;vertical-align:top'>●</th>";
        html += "<td style='width:100%'>";
        html += it;
        html += "</td>";
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    $("#eventBoard").html(html);
}

export = MetroDashboardPageProcessor;