import EventHandler from "../../core/event/EventHandler";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";

class ConversationPageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .attr("id", "eventBoard")
            .each((idx, td) => {
                const eventHtmlList: string[] = [];
                $(td).html()
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

                $(td).html(html);
            });

    }

}

export = ConversationPageProcessor;