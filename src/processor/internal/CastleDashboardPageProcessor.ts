import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import EventHandler from "../../pocket/EventHandler";

class CastleDashboardPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        this.#renderEventBoard();
    }

    #renderEventBoard() {
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

}

export = CastleDashboardPageProcessor;