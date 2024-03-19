import TownInformation from "../../core/dashboard/TownInformation";
import MapBuilder from "../../core/map/MapBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";
import TownLoader from "../../core/town/TownLoader";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import Town from "../../core/town/Town";
import TownStatus from "../../core/town/TownStatus";
import Constants from "../../util/Constants";

class TownInformationPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
        this.#processPage().then();
    }

    async #processPage() {
        const page = TownInformation.parsePage(PageUtils.currentPageHtml());

        // Render map
        let html = "";
        html += "<tr>";
        html += "<th colspan='2' style='text-align:center;font-size:180%;font-weight:bold;background-color:navy;color:yellowgreen'>";
        html += "＜＜  雷 姆 力 亚 城 市 情 报  ＞＞";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='map' style='background-color:#F8F0E0'></td>";
        html += "<td id='town' style='background-color:#F8F0E0;width:100%;text-align:center;vertical-align:center'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='townList' style='background-color:#F8F0E0;text-align:center' colspan='2'></td>";
        html += "</tr>";
        $("table:first")
            .attr("id", "t0")
            .find("> tbody:first")
            .html(html);
        $("#map").html(MapBuilder.buildMapTable());
        MapBuilder.renderTownBackgroundColor(page);

        for (const town of TownLoader.getTownList()) {
            const x = town.coordinate.x;
            const y = town.coordinate.y;
            const buttonId = "location_" + x + "_" + y;
            $("#" + buttonId)
                .on("mouseenter", event => {
                    let s = $(event.target).attr("id") as string;
                    s = StringUtils.substringAfter(s, "location_");
                    const coordinate = new Coordinate(
                        _.parseInt(StringUtils.substringBefore(s, "_")),
                        _.parseInt(StringUtils.substringAfter(s, "_"))
                    );
                    const town = TownLoader.load(coordinate)!;
                    const status = page.findByName(town.name)!;
                    $("#town").html(this.#generateTown(town, status));
                })
                .on("mouseleave", () => $("#town").html(""));
        }
    }

    #generateTown(town: Town, status: TownStatus): string {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0;width:240px'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<th colspan='2' style='background-color:darkslategray;color:lime;font-weight:bold;font-size:120%;text-align:center'>";
        html += town.name;
        html += "</th>";
        html += "</tr>";
        if (town.image !== "") {
            html += "<tr>";
            html += "<td colspan='2'>";
            html += "<img src='" + Constants.POCKET_DOMAIN + town.image + "' alt='" + town.name + "' width='240px'>";
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td colspan='2' style='text-align:left'>";
        html += town.description;
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "坐标"
        html += "</th>";
        html += "<td style='width:100%'>";
        html += town.coordinate.asText();
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "国家"
        html += "</th>";
        html += "<td style='width:100%;background-color:" + status.bgcolor + ";color:" + status.color + "'>";
        let c = status.country;
        if (c === "") {
            c = "在野";
        }
        if (status.capital) {
            c += " （首都）";
        }
        html += c;
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }
}

function doProcess() {
    $("td:contains('枫丹')")
        .filter(function () {
            return $(this).text() === "枫丹";
        })
        .next()
        .next()
        .find("font:first")
        .text("- GOLD");
}

export = TownInformationPageProcessor;