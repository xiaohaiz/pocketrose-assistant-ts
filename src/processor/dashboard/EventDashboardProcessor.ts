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
        console.log(PageUtils.currentPageHtml());
    }

}

function doProcess() {
    $("table:eq(3) tr:eq(1) td:first")
        .attr("id", "event_container");

    const originalEventHtmlList = doParseOriginalEventHtmlList();
    originalEventHtmlList.forEach(it => console.log(it));
}

function doParseOriginalEventHtmlList(): string[] {
    const originalEventHtmlList: string[] = [];
    $("#event_container").html()
        .split("<br>")
        .filter(it => it.endsWith(")"))
        .map(function (it) {
            const header = "<font color=\"green\">●</font>";
            return StringUtils.substringAfter(it, header);
        })
        .forEach(it => originalEventHtmlList.push(it));
    return originalEventHtmlList;
}


export = EventDashboardProcessor;