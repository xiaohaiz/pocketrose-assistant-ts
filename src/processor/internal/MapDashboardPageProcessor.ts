import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import EventHandler from "../../core/EventHandler";
import MapBuilder from "../../core/MapBuilder";
import RankTitleLoader from "../../core/RankTitleLoader";
import TravelPlanBuilder from "../../core/TravelPlanBuilder";
import TravelPlanExecutor from "../../core/TravelPlanExecutor";
import CastleInformation from "../../pocketrose/CastleInformation";
import MapDashboardPage from "../../pocketrose/MapDashboardPage";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class MapDashboardPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        if (context === undefined || context.get("coordinate") === undefined) {
            return;
        }

        const page = MapDashboardPage.parse(PageUtils.currentPageHtml());

        $("center:first")
            .attr("id", "systemAnnouncement");
        $("#systemAnnouncement")
            .after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
        // @ts-ignore
        $("#version").html(__VERSION__);

        if (SetupLoader.isQiHanTitleEnabled()) {
            $("table:first")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> td:first")
                .find("> form:first")
                .find("> font:first")
                .each((idx, font) => {
                    let c = $(font).text();

                    let b = StringUtils.substringAfterLast(c, "(");
                    let a = StringUtils.substringBefore(c, "(" + b);
                    b = StringUtils.substringBefore(b, ")");
                    const ss = _.split(b, " ");
                    const b1 = _.replace(ss[0], "部队", "");
                    const b2 = RankTitleLoader.transformTitle(ss[1]);
                    const b3 = ss[2];

                    const s = a + "(" + b1 + " " + b2 + " " + b3 + ")";
                    $(font).text(s);
                });
        }

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .attr("id", "mapRow");

        let travelJournals = $("#mapRow")
            .find("> td:last")
            .html();

        $("#mapRow").html("" +
            "<td colspan='2'>" +
            "<table style='background-color:transparent;margin:auto;width:100%'>" +
            "<tbody>" +
            "<tr>" +
            "<td id='map' style='background-color:#F8F0E0'></td>" +
            "<td id='travelJournals' style='background-color:#EFE0C0;width:100%'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>");
        $("#map").html(MapBuilder.buildMapTable());
        $("#travelJournals").html(travelJournals);

        MapBuilder.updateTownBackgroundColor();

        // 如果有必要的话绘制城堡
        new CastleInformation()
            .load(page.role!.name!)
            .then(castle => {
                const coordinate = castle.coordinate!;
                const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                $("#" + buttonId)
                    .attr("value", "堡")
                    .css("background-color", "fuchsia")
                    .parent()
                    .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                    .attr("class", "color_fuchsia");
            });

        const coordinate = Coordinate.parse(context.get("coordinate")!);
        const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
        $("#" + buttonId)
            .closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html($("#" + buttonId).val() as string);

        this.#bindLocationButtons(credential);

        this.#renderRankTitle();
        this.#renderExperience();
        this.#renderEventBoard();
    }

    #bindLocationButtons(credential: Credential) {
        const instance = this;

        $(".location_button_class")
            .on("mouseenter", function () {
                $(this).css("background-color", "red");
            })
            .on("mouseleave", function () {
                const s = $(this).parent().attr("class")!;
                const c = StringUtils.substringAfter(s, "_");
                if (c !== "none") {
                    $(this).css("background-color", c);
                } else {
                    $(this).removeAttr("style");
                }
            });
        $(".location_button_class").on("click", function () {
            const ss = ($(this).attr("id") as string).split("_");
            const x = parseInt(ss[1]);
            const y = parseInt(ss[2]);
            const coordinate = new Coordinate(x, y);

            const confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
            if (!confirmation) {
                return;
            }

            $("#mapRow")
                .next().hide()
                .next().hide()
                .next().hide()
                .next().hide();
            MessageBoard.createMessageBoardStyleC("travelJournals");
            $("#messageBoard")
                .closest("table")
                .css("height", "100%");
            $("#messageBoard")
                .parent()
                .before($("<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:left'>坐标点：<span id='roleLocation' style='color:red'>-</span></td>" +
                    "</tr>" +
                    "<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:left'>计时器：<span id='countDownTimer' style='color:red'>-</span></td>" +
                    "</tr>"));
            $("#messageBoard")
                .parent()
                .after($("<tr style='background-color:#EFE0C0'>" +
                    "<td style='text-align:center'><button role='button' id='refreshButton' disabled>移动中......</button></td>" +
                    "</tr>"));

            MessageBoard.resetMessageBoard("实时旅途动态播报：<br>");
            $(".location_button_class")
                .prop("disabled", true)
                .off("mouseenter")
                .off("mouseleave");

            instance.#doTravelToLocation(credential, coordinate);
        });
    }

    #renderRankTitle() {
        if (!SetupLoader.isQiHanTitleEnabled()) {
            return;
        }
        $("td:contains('身份')")
            .filter((idx, td) => $(td).text() === "身份")
            .next()
            .each((idx, th) => {
                let c = $(th).text();
                c = RankTitleLoader.transformTitle(c);
                $(th).text(c);
            });
    }

    #renderExperience() {
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return;
        }
        $("td:contains('经验值')")
            .filter(function () {
                return $(this).text() === "经验值";
            })
            .next()
            .each(function (_idx, th) {
                const expText = $(th).text();
                const experience = parseInt(StringUtils.substringBefore(expText, " EX"));
                if (experience >= 14900) {
                    $(th).css("color", "blue").text("MAX");
                } else {
                    const level = Math.ceil(experience / 100) + 1;
                    const ratio = level / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    $(th).html("<span title='" + expText + "'>" + progressBar + "</span>");
                }
            });
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

    #doTravelToLocation(credential: Credential, location: Coordinate) {
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

        const plan = TravelPlanBuilder.initializeTravelPlan(PageUtils.currentPageHtml());
        plan.destination = location;
        plan.credential = credential;
        const executor = new TravelPlanExecutor(plan);
        executor.execute()
            .then(() => {
                MessageBoard.publishMessage("旅途愉快，下次再见。");
                $("#refreshButton")
                    .prop("disabled", false)
                    .text("到达了目的地" + location.asText())
                    .on("click", () => {
                        $("input:submit[value='更新']").trigger("click");
                    });
            });
    }
}

export = MapDashboardPageProcessor;