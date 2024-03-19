import TownInformation from "../../core/dashboard/TownInformation";
import MapBuilder from "../../core/map/MapBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

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
        html += "<td id='map' style='background-color:#F8F0E0'></td>";
        html += "<td id='status' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='list' style='background-color:#F8F0E0;text-align:center' colspan='2'></td>";
        html += "</tr>";
        $("table:first")
            .attr("id", "t0")
            .find("> tbody:first")
            .html(html);
        $("#map").html(MapBuilder.buildMapTable());
        MapBuilder.renderTownBackgroundColor(page);
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