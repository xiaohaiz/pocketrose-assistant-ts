import _ from "lodash";
import PersonalChampionRole from "../../core/champion/PersonalChampionRole";
import TownPersonalChampionPage from "../../core/champion/TownPersonalChampionPage";
import TownPersonalChampionPageParser from "../../core/champion/TownPersonalChampionPageParser";
import TownInformation from "../../core/dashboard/TownInformation";
import TownStatus from "../../core/town/TownStatus";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPersonalChampionPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await new TownPersonalChampionPageParser().parse(PageUtils.currentPageHtml());
        await this.#processPage(page)
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

        $("th:contains('比武对手一览')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "比武对手一览");
            })
            .closest("table")
            .parent()
            .parent()
            .parent()
            .parent()
            .attr("id", "candidates")
            .removeAttr("align")
            .removeAttr("cellpadding")
            .removeAttr("cellspacing")
            .removeAttr("border")
            .css("background-color", "#888888")
            .css("text-align", "center");

        $("th:contains('-- 历 代 优 胜 者 --')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "-- 历 代 优 胜 者 --");
            })
            .closest("table")
            .attr("id", "winners")
            .removeAttr("cellspacing")
            .removeAttr("bgcolor")
            .css("background-color", "#888888");

        await this.#renderCandidates(page);
        await this.#renderWinners(page);
    }

    async #renderCandidates(page: TownPersonalChampionPage) {
        const roles = new Map<string, PersonalChampionRole>();
        for (const role of page.candidates!) {
            roles.set(role.townName!, role);
        }
        const townInformationPage = await new TownInformation().open();
        let maxSize = 0;
        const countries = townInformationPage.countries;
        for (const c of countries) {
            const list = townInformationPage.getTownList(c);
            maxSize = _.max([maxSize, list.length])!;
        }

        let html = "";
        html += "<table style='border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='" + (maxSize + 1) + "' " +
            "style='background-color:#E0D0B0;color:red;font-size:120%'>";
        html += "-- 报 名 者 一 览 --";
        html += "</th>";
        html += "</tr>";
        for (const c of countries) {
            const list = townInformationPage.getTownList(c);
            html += "<tr>";
            html += "<th style='background-color:black;color:white;white-space:nowrap'>";
            html += (c === "") ? "★" : c;
            html += "</th>";
            for (let i = 0; i < maxSize; i++) {
                let status: TownStatus | undefined = undefined;
                if (i < list.length) {
                    status = list[i];
                }
                html += "<td>";
                html += this.#generateCandidate(status, roles);
                html += "</td>";
            }
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";

        $("#candidates")
            .find("> tbody:first")
            .find("> tr")
            .each((_idx, tr) => {
                $(tr).hide();
            });
        $("#candidates")
            .find("> tbody:first")
            .append($("<tr><td>" + html + "</td></tr>"));
    }

    async #renderWinners(page: TownPersonalChampionPage) {
        let html = "";
        html += "<table style='border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='" + page.winners!.length + "' " +
            "style='background-color:#E0D0B0;color:red;font-size:120%'>";
        html += "-- 历 代 优 胜 者 --";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        for (const winner of page.winners!) {
            html += "<td style='background-color:#F8F0E0;width:65px'>";
            html += winner.imageHtml;
            html += "</td>";
        }
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#winners")
            .find("> tbody:first")
            .find("> tr")
            .each((_idx, tr) => {
                $(tr).hide();
            });
        $("#winners")
            .find("> tbody:first")
            .append($("<tr><td>" + html + "</td></tr>"));
    }

    #generateCandidate(status: TownStatus | undefined, roles: Map<string, PersonalChampionRole>): string {
        let role: PersonalChampionRole | undefined = undefined;
        if (status) {
            role = roles.get(status.name!);
        }
        let html = "";
        html += "<table style='border-width:0;background-color:#F8F0E0;text-align:center'>";
        html += "<tbody>";
        html += "<tr>";
        if (status) {
            html += "<th style='width:80px;background-color:skyblue;white-space:nowrap'>";
            html += status.name;
            html += "</th>";
        } else {
            html += "<th style='width:80px;background-color:#F8F0E0;white-space:nowrap'>";
            html += "&nbsp;";
            html += "</th>";
        }
        html += "</tr>";
        html += "<tr>";
        html += "<td style='width:80px;height:65px'>";
        if (role) {
            html += role.imageHtml;
        }
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }
}

export = TownPersonalChampionPageProcessor;