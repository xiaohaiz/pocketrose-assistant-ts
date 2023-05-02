import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";

class EventDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("各国资料");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        PageUtils.fixCurrentPageBrokerImages();
        doProcess();
    }

}

function doProcess() {
    $("table:eq(3) tr:eq(1) td:first")
        .attr("id", "eventBoard");
    const eventHtmlList = doParseEventHtmlList();
    doRenderEventBoard(eventHtmlList);
}

function doParseEventHtmlList(): string[] {
    const eventHtmlList: string[] = [];
    $("#eventBoard").html()
        .split("<br>")
        .filter(it => it.endsWith(")"))
        .map(function (it) {
            const header = "<font color=\"green\">●</font>";
            return StringUtils.substringAfter(it, header);
        })
        .forEach(it => eventHtmlList.push(it));
    return eventHtmlList;
}

function doRenderEventBoard(eventHtmlList: string[]) {
    let html = "";
    html += "<table style='border-width:0;width:100%;margin:auto'>";
    html += "<tbody>";
    eventHtmlList.forEach(it => {
        html += "<tr>";
        html += "<th style='color:green;vertical-align:top'>●</th>";
        html += "<td style='width:100%'>";
        html += it;
        html += "</td>";
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    $("#eventBoard").html(html);
}


export = EventDashboardProcessor;