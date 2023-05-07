import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../../pocket/SetupLoader";
import EventHandler from "../../pocket/EventHandler";
import LocationStateMachine from "../../core/LocationStateMachine";

class MapDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi" || cgi === "status.cgi") {
            return pageText.includes("请选择移动的格数");
        }
        return false;
    }

    process(): void {
        LocationStateMachine.currentLocationStateMachine().inWild();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        PageUtils.fixCurrentPageBrokenImages();
        doProcess();
    }

}

function doProcess() {
    doRenderExperienceProgressBar();
    doRenderEventBoard();
}

function doRenderExperienceProgressBar() {
    if (!SetupLoader.isExperienceProgressBarEnabled()) {
        return;
    }
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

function doRenderEventBoard() {
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
            const header = "<font color=\"navy\">●</font>";
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

export = MapDashboardProcessor;