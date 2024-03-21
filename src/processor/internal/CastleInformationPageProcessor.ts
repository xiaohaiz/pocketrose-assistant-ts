import _ from "lodash";
import CastleInformation from "../../core/dashboard/CastleInformation";
import CastleInformationPage from "../../core/dashboard/CastleInformationPage";
import MapBuilder from "../../core/map/MapBuilder";
import Coordinate from "../../util/Coordinate";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessor from "../PageProcessor";

class CastleInformationPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        this.#processPage().then();
    }

    async #processPage() {
        const page = CastleInformation.parsePage(PageUtils.currentPageHtml());

        let html = "";
        html += "<tr>";
        html += "<th colspan='2' style='text-align:center;font-size:180%;font-weight:bold;background-color:navy;color:yellowgreen'>";
        html += "＜＜  雷 姆 力 亚 城 堡 情 报  ＞＞";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='map' style='background-color:#F8F0E0;vertical-align:top'></td>";
        html += "<td id='castle' style='background-color:#F8F0E0;width:100%;text-align:center;vertical-align:center'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='command' style='display:none;background-color:#F8F0E0;text-align:center' colspan='2'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='castleList' style='background-color:#F8F0E0;text-align:center' colspan='2'></td>";
        html += "</tr>";

        $("table:first")
            .attr("id", "t0")
            .find("> tbody:first")
            .html(html);
        $("#map").html(MapBuilder.buildMapTable());

        await this.#renderMap(page);

        this.#renderCastleList(page);
    }

    async #renderMap(page: CastleInformationPage) {
        for (const it of page.coordinateList) {
            const c = Coordinate.parse(it);
            const cs = page.findByCoordinate(c);
            let buttonValue = _.toString(cs.length);
            if (cs.length >= 10) {
                buttonValue = "X";
            }
            const buttonId = "location_" + c.x + "_" + c.y;
            $("#" + buttonId)
                .css("background-color", "blue")
                .css("color", "white")
                .val(buttonValue)
                .on("mouseenter", event => {
                    let s = $(event.target).attr("id") as string;
                    s = StringUtils.substringAfter(s, "location_");
                    const coordinate = new Coordinate(
                        _.parseInt(StringUtils.substringBefore(s, "_")),
                        _.parseInt(StringUtils.substringAfter(s, "_"))
                    );
                    $("#castle").html(this.#generateCastleList(coordinate, page));
                })
                .on("mouseleave", () => $("#castle").html(""));
        }
    }

    #generateCastleList(coordinate: Coordinate, page: CastleInformationPage): string {
        const cs = page.findByCoordinate(coordinate);
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<th style='text-align:center;background-color:skyblue;font-size:120%' colspan='2'>";
        html += "坐标： " + coordinate.asText();
        html += "</th>";
        html += "</tr>";
        for (let i = 0; i < cs.length; i++) {
            const c = cs[i];
            html += "<tr>";
            html += "<th style='vertical-align:center;background-color:black;color:white' rowspan='2'>";
            html += (i + 1);
            html += "</th>";
            html += "<th style='text-align:left;color:blue'>";
            html += c.owner;
            html += "</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='text-align:left'>";
            html += c.name;
            html += "</td>";
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    #renderCastleList(page: CastleInformationPage) {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0;width:240px'>";
        html += "<tbody style='background-color:#F8F0E0;white-space:nowrap'>";
        html += "<tr style='background-color:skyblue;text-align:center'>";
        html += "<th>城堡</th>"
        html += "<th>主人</th>"
        html += "<th>坐标</th>"
        html += "<th>属性</th>"
        html += "<th>开发</th>"
        html += "<th>商业</th>"
        html += "<th>工业</th>"
        html += "<th>矿产</th>"
        html += "<th>防御</th>"
        html += "</tr>";
        const castles = page.castleList!;
        for (let i = 0; i < castles.length; i++) {
            const castle = castles[i];
            html += "<tr>";
            html += "<td>";
            html += castle.name;
            html += "</td>";
            html += "<td>";
            html += castle.owner;
            html += "</td>";
            html += "<td>";
            html += castle.coordinate!.asText();
            html += "</td>";
            html += "<td>";
            html += castle.attribute;
            html += "</td>";
            html += "<td>";
            html += castle.development;
            html += "</td>";
            html += "<td>";
            html += castle.commerce;
            html += "</td>";
            html += "<td>";
            html += castle.industry;
            html += "</td>";
            html += "<td>";
            html += castle.mineral;
            html += "</td>";
            html += "<td>";
            html += castle.defense;
            html += "</td>";
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        $("#castleList").html(html);
    }
}

export = CastleInformationPageProcessor;