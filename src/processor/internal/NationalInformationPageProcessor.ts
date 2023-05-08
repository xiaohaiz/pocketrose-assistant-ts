import StringUtils from "../../util/StringUtils";
import EventHandler from "../../pocket/EventHandler";
import PageProcessor from "../PageProcessor";

class NationalInformationPageProcessor implements PageProcessor {

    process(): void {
        this.#renderEventBoard();
    }

    #renderEventBoard() {
        $("table:eq(3) tr:eq(1) td:first")
            .attr("id", "eventBoard");

        const eventHtmlList: string[] = [];
        $("#eventBoard").html()
            .split("<br>")
            .filter(it => it.endsWith(")"))
            .map(function (it) {
                // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
                const header: string = "<font color=\"green\">●</font>";
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

}

export = NationalInformationPageProcessor;