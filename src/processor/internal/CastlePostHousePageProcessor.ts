import Town from "../../core/Town";
import TownLoader from "../../core/TownLoader";
import CastleEntrance from "../../pocket/CastleEntrance";
import MapBuilder from "../../pocket/MapBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import TownEntrance from "../../pocket/TownEntrance";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";
import CastleBank from "../../pocketrose/CastleBank";
import TownBank from "../../pocketrose/TownBank";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CastlePostHousePageProcessor extends PageProcessorCredentialSupport {

    constructor() {
        super();
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    const t0 = $("table:first");
    const t2 = $("table:eq(2)");
    const t3 = $("table:eq(3)");

    $(t0).removeAttr("height");

    // 修改标题
    let td = $(t0).find("tr:first td:first");
    $(td).removeAttr("bgcolor");
    $(td).removeAttr("width");
    $(td).removeAttr("height");
    $(td).css("text-align", "center");
    $(td).css("font-size", "150%");
    $(td).css("font-weight", "bold");
    $(td).css("background-color", "navy");
    $(td).css("color", "yellowgreen");
    $(td).attr("id", "title");
    $(td).text("＜＜  城 堡 驿 站  ＞＞");

    // 现金栏、坐标点、计时器
    td = $(t2).find("tr:eq(2) td:last");
    $(td).attr("id", "roleCash");
    let tr = $(t2).find("tr:eq(3)");
    td = $(tr).find("td:first");
    $(td).text("坐标点");
    td = $(tr).find("td:last");
    $(td).attr("id", "roleLocation");
    $(td).text("-");
    $(tr).after($("<tr>" +
        "<td style='background-color:#E0D0B0'>计时器</td>" +
        "<td style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' id='countDownTimer' colspan='2'>-</td>" +
        "</tr>"));

    // 消息面板
    td = $(t3).find("td:first");
    $(td).attr("id", "messageBoard");
    $(td).css("color", "white");
    MessageBoard.resetMessageBoard("如您所愿，我们已经降废弃的机车建造厂改造成了城堡驿站。");

    // 删除不需要的页面内容
    tr = $(t3).parent().parent();
    $(tr).next().remove();

    // 绘制驿站的新页面
    $(tr).after($("" +
        "<tr style='display:none'>" +
        "<td id='eden'></td>" +
        "</tr>" +
        "<tr>" +
        "<td id='menu' style='background-color:#F8F0E0;text-align:center'></td>" +
        "</tr>" +
        "<tr style='display:none'>" +
        "<td id='map' style='background-color:#F8F0E0;text-align:center'></td>" +
        "</tr>" +
        ""));

    doRenderEden(credential);
    doRenderMenu();
    doRenderMap(credential);
}

function doRenderEden(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='castlestatus.cgi' method='post' id='returnForm'>"
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    $("#eden").html(html);
}

function doRenderMenu() {
    $("#menu").html("" +
        "<input type='button' id='returnButton' value='返回城堡'>"
    );
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRenderMap(credential: Credential) {
    const html = MapBuilder.buildMapTable();
    $("#map").html(html);
    MapBuilder.updateTownBackgroundColor();

    new RoleLoader(credential).load()
        .then(role => {
            const castle = role.castle!;
            const buttonId = "location_" + castle.coordinate!.x + "_" + castle.coordinate!.y;
            $("#" + buttonId)
                .closest("td")
                .css("background-color", "black")
                .css("color", "yellow")
                .css("text-align", "center")
                .html("堡");

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

            $("#map").parent().show();

            doBindMapButton(credential);
        });
}

function doBindMapButton(credential: Credential) {
    $(".location_button_class").on("click", function () {
        const title = $(this).parent().attr("title")!;
        const ss = ($(this).attr("id") as string).split("_");
        const x = parseInt(ss[1]);
        const y = parseInt(ss[2]);
        const coordinate = new Coordinate(x, y);

        let townName = "";
        let confirmation = false;
        if (title.startsWith("城市")) {
            townName = StringUtils.substringAfterLast(title, " ");
            confirmation = confirm("确认移动到" + townName + "？");
        } else if (title.startsWith("坐标")) {
            confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
        }
        if (!confirmation) {
            return;
        }

        // 准备切换到移动模式
        document.getElementById("title")?.scrollIntoView();
        MessageBoard.resetMessageBoard("我们将实时为你播报旅途的动态：<br>");
        $("#returnButton")
            .prop("disabled", true)
            .val("旅途中请耐心等候......");
        $(".location_button_class")
            .prop("disabled", true)
            .off("mouseenter")
            .off("mouseleave");

        if (townName !== "") {
            const town = TownLoader.getTownByCoordinate(coordinate)!;
            doTravelToTown(credential, town);
        } else {
            doTravelToLocation(credential, coordinate);
        }
    });
}

function doTravelToTown(credential: Credential, town: Town) {
    MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + town.name + "</span>");
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + town.coordinate.asText() + "</span>");

    const castleBank = new CastleBank(credential);
    castleBank.withdraw(10)
        .then(() => {
            castleBank.load()
                .then(account => {
                    $("#roleCash").text(account.cash + " GOLD");
                });

            new CastleEntrance(credential).leave()
                .then(plan => {
                    plan.destination = town.coordinate;
                    new TravelPlanExecutor(plan).execute()
                        .then(() => {
                            new TownEntrance(credential).enter(town.id)
                                .then(() => {
                                    const bank = new TownBank(credential);
                                    bank.deposit().then(() => {
                                        bank.load().then(account => {
                                            $("#roleCash").text(account.cash + " GOLD");
                                        });

                                        MessageBoard.publishMessage("旅途愉快，下次再见。");
                                        $("#returnForm")
                                            .attr("action", "status.cgi")
                                            .find("input:hidden[name='mode']")
                                            .val("STATUS");
                                        $("#returnButton")
                                            .prop("disabled", false)
                                            .val(town.name + "欢迎您");
                                    });
                                });
                        });
                });
        })
        .catch(() => {
            MessageBoard.publishWarning("因为没有足够的保证金，旅途被中断！");
            MessageBoard.publishMessage("回去吧，没钱就别来了。");
            $("#returnButton")
                .prop("disabled", false)
                .val("真可怜钱不够");
        });
}

function doTravelToLocation(credential: Credential, location: Coordinate) {
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

    new CastleEntrance(credential).leave()
        .then(plan => {
            plan.destination = location;
            const executor = new TravelPlanExecutor(plan);
            executor.execute()
                .then(() => {
                    MessageBoard.publishMessage("旅途愉快，下次再见。");
                    $("#returnForm")
                        .attr("action", "status.cgi")
                        .find("input:hidden[name='mode']")
                        .val("STATUS");
                    $("#returnButton")
                        .prop("disabled", false)
                        .val("到达了目的地" + location.asText());
                });
        });
}

export = CastlePostHousePageProcessor;
