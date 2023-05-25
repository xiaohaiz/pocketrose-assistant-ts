import _ from "lodash";
import TravelPlan from "../../common/TravelPlan";
import SetupLoader from "../../config/SetupLoader";
import EventHandler from "../../core/EventHandler";
import MapBuilder from "../../core/MapBuilder";
import RankTitleLoader from "../../core/RankTitleLoader";
import TravelPlanExecutor from "../../core/TravelPlanExecutor";
import MetroDashboardPage from "../../pocketrose/MetroDashboardPage";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class MetroDashboardPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = MetroDashboardPage.parse(PageUtils.currentPageHtml());

        renderAnnouncement();
        renderMobilization();
        renderRoleStatus();
        renderEventBoard();
        renderMetroMap(credential, page);
    }

}

function renderAnnouncement() {
    // --------------------------------------------------------------------
    // 系统公告
    // --------------------------------------------------------------------
    $("center:first")
        .attr("id", "systemAnnouncement");
    $("#systemAnnouncement")
        .after($("<div id='version' style='color:navy;font-weight:bold;text-align:center;width:100%'></div>"));
    // @ts-ignore
    $("#version").html(__VERSION__);
}

function renderMobilization() {
    // --------------------------------------------------------------------
    // 国家动员指令
    // --------------------------------------------------------------------
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
}

function renderRoleStatus() {
    // --------------------------------------------------------------------
    // 身份
    // --------------------------------------------------------------------
    if (SetupLoader.isQiHanTitleEnabled()) {
        $("td:contains('身份')")
            .filter((idx, td) => $(td).text() === "身份")
            .next()
            .each((idx, th) => {
                let c = $(th).text();
                c = RankTitleLoader.transformTitle(c);
                $(th).text(c);
            });
    }

    // --------------------------------------------------------------------
    // 经验值
    // --------------------------------------------------------------------
    if (SetupLoader.isExperienceProgressBarEnabled()) {
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
}

function renderEventBoard() {
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

function renderMetroMap(credential: Credential, page: MetroDashboardPage) {
    $("table:first")
        .find("tbody:first")
        .find("> tr:eq(2)")
        .html("" +
            "<td colspan='2' id='mapContainer'>" +
            "<table style='background-color:transparent;margin:auto;width:100%'>" +
            "<tbody>" +
            "<tr>" +
            "<td id='map' style='background-color:#F8F0E0'></td>" +
            "<td id='menu' style='background-color:#EFE0C0;width:100%'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>");
    $("#map").html(MapBuilder.buildBlankMapTable());

    let buttonId = "location_" + page.coordinate!.x + "_" + page.coordinate!.y;
    $("#" + buttonId)
        .closest("td")
        .css("background-color", "black")
        .css("color", "yellow")
        .css("text-align", "center")
        .html("你");

    buttonId = "location_8_9";
    $("#" + buttonId)
        .attr("value", "雪")
        .css("background-color", "fuchsia")
        .parent()
        .attr("title", "白雪公主和小矮人")
        .attr("class", "color_fuchsia");
    buttonId = "location_10_10";
    $("#" + buttonId)
        .attr("value", "匹")
        .css("background-color", "fuchsia")
        .parent()
        .attr("title", "匹诺曹")
        .attr("class", "color_fuchsia");

    let html = "";
    html += "<table style='background-color:transparent;margin:auto;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='text-align:left'>坐标点：<span id='roleLocation' style='color:red'>" + page.coordinate!.asText() + "</span></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:left'>计时器：<span id='countDownTimer' style='color:red'>-</span></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='messageBoardContainer'></td>";
    html += "</tr>";
    html += "<tr style='display:none;text-align:center'>";
    html += "<td><button role='button' id='refreshButton' disabled>移动中......</button></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("#menu").html(html);

    MessageBoard.createMessageBoardStyleC("messageBoardContainer");
    $("#messageBoard")
        .closest("table")
        .css("height", "100%");

    doBindLocationButton(credential, page);
}

function doBindLocationButton(credential: Credential, page: MetroDashboardPage) {

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

        $("#mapContainer")
            .parent()
            .next().hide()
            .next().hide()
            .next().hide()
            .next().hide();

        $("#refreshButton").parent().parent().show();

        MessageBoard.resetMessageBoard("实时旅途动态播报：<br>");
        $(".location_button_class")
            .prop("disabled", true)
            .off("mouseenter")
            .off("mouseleave");

        doTravelToLocation(credential, page, coordinate);
    });
}

function doTravelToLocation(credential: Credential, page: MetroDashboardPage, location: Coordinate) {
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

    const plan = new TravelPlan();
    plan.scope = page.scope;
    plan.mode = page.mode;
    plan.source = page.coordinate;
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

export = MetroDashboardPageProcessor;