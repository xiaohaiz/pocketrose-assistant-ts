import _ from "lodash";
import TownPersonalChampionPage from "../../core/champion/TownPersonalChampionPage";
import TownPersonalChampionPageParser from "../../core/champion/TownPersonalChampionPageParser";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPersonalChampionPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await new TownPersonalChampionPageParser().parse(PageUtils.currentPageHtml());
        this.#processPage(page)
            .then(() => {
                KeyboardShortcutBuilder.newInstance()
                    .onEscapePressed(() => $("#returnButton").trigger("click"))
                    .withDefaultPredicate()
                    .bind();
            });
    }

    async #processPage(page: TownPersonalChampionPage) {
        $("table:eq(1)")
            .find("td:first")
            .attr("id", "pageTitle")
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

        await this.#renderWinners(page);
    }

    async #renderWinners(page: TownPersonalChampionPage) {
        $("th:contains('-- 历 代 优 胜 者 --')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "-- 历 代 优 胜 者 --");
            })
            .closest("table")
            .attr("id", "winners");

        let html = "";
        html += "<table style='border-width:0;margin:auto'></table>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='" + page.winners!.length + "' " +
            "style='background-color:#E0D0B0;color:red;font-size:120%'>";
        html += "-- 历 代 优 胜 者 --";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        for (const winner of page.winners!) {
            html += "<td style='background-color:#F8F0E0;width:64px'>";
            html += winner.imageHtml;
            html += "</td>";
        }
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#winners")
            .removeAttr("cellspacing")
            .removeAttr("bgcolor")
            .css("background-color", "#888888")
            .find("> tbody:first")
            .html("<tr><td>" + html + "</td></tr>");
    }
}

export = TownPersonalChampionPageProcessor;