import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import MapBuilder from "../../pocket/MapBuilder";
import RoleLocationLoader from "../../pocket/RoleLocationLoader";
import StringUtils from "../../util/StringUtils";
import CastleLoader from "../../pocket/CastleLoader";
import Coordinate from "../../util/Coordinate";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TravelPlanBuilder from "../../pocket/TravelPlanBuilder";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";

/**
 * @deprecated
 */
class MapPostHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("＜＜住所＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    $("input:submit[value='返回上个画面']").attr("id", "returnButton");
    $("table[height='100%']").removeAttr("height");

    $("table:eq(1)")
        .find("td:first")
        .removeAttr("bgcolor")
        .removeAttr("width")
        .removeAttr("height")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "greenyellow")
        .attr("id", "title")
        .text("＜＜　 住 所 & 简 易 驿 站 　＞＞");

    const player = $("table:eq(4)")
        .find("tr:first")
        .next()
        .find("td:first")
        .text();

    $("table:eq(4)")
        .find("tr:last")
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td id='roleLocation' style='background-color:#E8E8D0;text-align:right;color:red;font-weight:bold' colspan='3'>-</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>计时器</td>" +
            "<td id='countDownTimer' style='background-color:#E8E8D0;text-align:right;color:red;font-weight:bold' colspan='3'>-</td>" +
            "</tr>" +
            "<tr style='display:none'><td id='eden' colspan='4'></td></tr>"
        ));

    $("table:eq(5)")
        .find("td:first")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .attr("id", "messageBoard")
        .html("简易驿站能带您去地图上任意的一个坐标点，也仅此而已。")
        .next()
        .html(NpcLoader.randomNpcImageHtml());

    let html = "";
    html += "<tr style='display:none'>";
    html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'>";
    html += "</td>"
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='postHouse' style='background-color:#F8F0E0;text-align:center'>";
    html += "</td>"
    html += "</tr>";

    $("#returnButton")
        .closest("tr")
        .attr("id", "visitRow")
        .after($(html));

    doGenerateEdenForm(credential);
    doGenerateMenu();
    doRender(credential, player);
}

function doGenerateEdenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='returnForm'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    html += "</form>";
    $("#eden").html(html);
}

function doGenerateMenu() {
    $("#menu").html("<input type='button' id='travelButton' " +
        "disabled value='旅途中请耐心等候......'>");
    $("#travelButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRender(credential: Credential, player: string) {
    $("#postHouse").html(MapBuilder.buildMapTable());
    MapBuilder.updateTownBackgroundColor();

    new RoleLocationLoader(credential).load()
        .then(location => {
            const x = location.coordinate!.x;
            const y = location.coordinate!.y;
            const buttonId = "location_" + x + "_" + y;
            $("#" + buttonId)
                .closest("td")
                .css("background-color", "black")
                .css("color", "yellow")
                .css("text-align", "center")
                .html("我");

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

            $("#postHouse").parent().show();

            CastleLoader.loadCastle(player)
                .then(castle => {
                    if (castle === null) {
                        return;
                    }
                    const coordinate = castle.coordinate!;
                    if (location.coordinate!.equals(coordinate)) {
                        return;
                    }
                    const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                    $("#" + buttonId)
                        .attr("value", "堡")
                        .css("background-color", "fuchsia")
                        .parent()
                        .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                        .attr("class", "color_fuchsia");
                });

            doBind(credential);
        });
}

function doBind(credential: Credential) {
    $(".location_button_class").on("click", function () {
        const ss = ($(this).attr("id") as string).split("_");
        const x = parseInt(ss[1]);
        const y = parseInt(ss[2]);
        const coordinate = new Coordinate(x, y);

        const confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
        if (!confirmation) {
            return;
        }

        document.getElementById("title")?.scrollIntoView();
        MessageBoard.resetMessageBoard("虽然我们的驿站很简陋，但是也有实时旅途动态播报：<br>");
        $("#visitRow").hide();
        $(".location_button_class")
            .prop("disabled", true)
            .off("mouseenter")
            .off("mouseleave");
        $("#menu").parent().show();

        doTravelToLocation(credential, coordinate);
    });
}

function doTravelToLocation(credential: Credential, location: Coordinate) {
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

    const request = credential.asRequest();
    // @ts-ignore
    request.mode = "STATUS";
    NetworkUtils.sendPostRequest("status.cgi", request, function (pageHtml) {
        const plan = TravelPlanBuilder.initializeTravelPlan(pageHtml);
        plan.destination = location;
        plan.credential = credential;
        const executor = new TravelPlanExecutor(plan);
        executor.execute()
            .then(() => {
                MessageBoard.publishMessage("旅途愉快，下次再见。");
                $("#travelButton")
                    .prop("disabled", false)
                    .val("到达了目的地" + location.asText());
            });
    });
}

export = MapPostHouseProcessor;