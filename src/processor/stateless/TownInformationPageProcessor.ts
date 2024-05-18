import _ from "lodash";
import {TownInformationPage, TownInformationPageParser} from "../../core/dashboard/TownInformationPage";
import MapBuilder from "../../core/map/MapBuilder";
import Town from "../../core/town/Town";
import TownLoader from "../../core/town/TownLoader";
import TownStatus from "../../core/town/TownStatus";
import Constants from "../../util/Constants";
import Coordinate from "../../util/Coordinate";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessor from "../PageProcessor";

class TownInformationPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        this.#processPage().then();
    }

    async #processPage() {
        const page = TownInformationPageParser.parse(PageUtils.currentPageHtml());

        // Render map
        let html = "";
        html += "<tr>";
        html += "<th colspan='2' style='text-align:center;font-size:180%;font-weight:bold;background-color:navy;color:yellowgreen'>";
        html += "＜＜  雷 姆 力 亚 城 市 情 报  ＞＞";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='map' style='background-color:#F8F0E0;vertical-align:top'></td>";
        html += "<td id='town' style='background-color:#F8F0E0;width:100%;text-align:center;vertical-align:center'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='command' style='background-color:#F8F0E0;text-align:center' colspan='2'></td>";
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

        // command
        let c = "";
        c += "<input type='text' id='searchName' size='15' maxlength='20' spellcheck='false'>";
        c += "<input type='button' id='searchButton' value='根据特产品查找'>";
        $("#command").html(c);
        $("#searchButton").on("click", () => {
            const s = $("#searchName").val() as string;
            const candidate: TownStatus[] = [];
            for (const status of page.statusList!) {
                const town = TownLoader.load(status.name)!;
                if (town.hasSpecial(s)) {
                    candidate.push(status);
                }
            }
            const p = new TownInformationPage();
            p.statusList = candidate;
            p.initialize();
            this.#renderTownList(p);
        });

        this.#renderTownList(page);
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
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "属性"
        html += "</th>";
        html += "<td style='width:100%'>";
        html += status.attribute;
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "收益"
        html += "</th>";
        html += "<td style='width:100%'>";
        if (status.country === "") {
            html += "PRIVACY";
        } else {
            html += (status.tax + " GOLD");
        }
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "武器"
        html += "</th>";
        html += "<td style='width:100%'>";
        html += town.specialWeaponsList;
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "防具"
        html += "</th>";
        html += "<td style='width:100%'>";
        html += town.specialArmorsList;
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<th style='text-align:left;white-space:nowrap'>";
        html += "饰品"
        html += "</th>";
        html += "<td style='width:100%'>";
        html += town.specialAccessoriesList;
        html += "</td>";
        html += "</tr>";
        // --------------------------------------------------------------------
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    #renderTownList(page: TownInformationPage) {
        $(".townStatusButton").off("click");
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0;width:240px'>";
        html += "<tbody style='background-color:#F8F0E0;white-space:nowrap'>";
        html += "<tr style='background-color:skyblue;text-align:center'>";
        html += "<th>国家</th>"
        html += "<th>首都</th>"
        html += "<th>城市</th>"
        html += "<th>坐标</th>"
        html += "<th>属性</th>"
        html += "<th>收益</th>"
        html += "<th>查看</th>"
        html += "</tr>";
        for (const c of page.countries) {
            const townList = page.getTownList(c);
            for (let i = 0; i < townList.length; i++) {
                const status = townList[i];
                const town = TownLoader.load(status.name)!;
                html += "<tr>";
                if (i === 0) {
                    html += "<th rowspan='" + (townList.length) + "' " +
                        "style='background-color:black;vertical-align:center;color:white'>";
                    html += (status.country === "" ? "在野" : status.country);
                    html += "</th>";
                }
                html += "<td>";
                if (status.capital) {
                    html += "★";
                }
                html += "</td>";
                html += "<td style='background-color:" + status.bgcolor + ";color:" + status.color + "'>";
                html += status.name;
                html += "</td>";
                html += "<td style='background-color:" + status.bgcolor + ";color:" + status.color + "'>";
                html += town.coordinate.asText();
                html += "</td>";
                html += "<td style='background-color:" + status.bgcolor + ";color:" + status.color + "'>";
                html += status.attribute;
                html += "</td>";
                html += "<td style='background-color:" + status.bgcolor + ";color:" + status.color + "'>";
                if (status.country === "") {
                    html += "PRIVACY";
                } else {
                    html += (status.tax + " GOLD");
                }
                html += "</td>";
                html += "<td style='background-color:" + status.bgcolor + ";color:" + status.color + "'>";
                html += "<input type='button' id='town_" + town.id + "' class='townStatusButton' value='详情'>"
                html += "</td>";
                html += "</tr>";
            }
        }
        html += "</tbody>";
        html += "</table>";
        $("#townList").html(html);
        $(".townStatusButton").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const townId = StringUtils.substringAfter(buttonId, "_");
            const town = TownLoader.load(townId)!;
            const status = page.findByName(town.name)!;
            $("#town").html(this.#generateTown(town, status));
            PageUtils.scrollIntoView("town");
        });
    }
}

export = TownInformationPageProcessor;