import PageProcessor from "../PageProcessor";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import TownLoader from "../../pocket/TownLoader";
import CastleBank from "../../pocket/CastleBank";
import CastleEntrance from "../../pocket/CastleEntrance";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";
import TownEntrance from "../../pocket/TownEntrance";
import TownBank from "../../pocket/TownBank";
import MapBuilder from "../../pocket/MapBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import StringUtils from "../../util/StringUtils";

class CastlePostHouseProcessor extends PageProcessor {
    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
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

    new RoleLoader(credential).load()
        .then(role => {
            const castle = role.castle!;
            const buttonId = "location_" + castle.coordinate!.x + "_" + castle.coordinate!.y;
            $("#" + buttonId)
                .closest("td")
                .css("background-color", "black")
                .css("color", "white")
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
        });
}

function doBindTownButton(credential: Credential) {
    $("#townButton").on("click", function () {
        const destinationTownId = $("input:radio:checked").val();
        if (destinationTownId === undefined) {
            MessageBoard.publishWarning("没有选择目的地城市！");
            return;
        }

        MessageBoard.resetMessageBoard("我们将实时为你播报旅途的动态：<br>");
        $("#returnButton").prop("disabled", true);
        $("#townButton").prop("disabled", true);
        $("#townButton").css("color", "grey");
        $("input:radio").prop("disabled", true);

        const destinationTown = TownLoader.getTownById(destinationTownId as string)!;
        MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + destinationTown.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + destinationTown.coordinate.asText() + "</span>");

        const castleBank = new CastleBank(credential);
        castleBank.withdraw(10)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("因为没有足够的保证金，旅途被中断！");
                    MessageBoard.publishMessage("回去吧，没钱就别来了。");
                    $("#returnButton").prop("disabled", false);
                    return;
                }

                castleBank.loadBankAccount()
                    .then(account => {
                        $("#roleCash").text(account.cash + " GOLD");
                    });

                new CastleEntrance(credential).leave()
                    .then(plan => {
                        plan.destination = destinationTown.coordinate;
                        new TravelPlanExecutor(plan).execute()
                            .then(() => {
                                new TownEntrance(credential).enter(destinationTown.id)
                                    .then(() => {
                                        const townBank = new TownBank(credential);
                                        townBank.deposit(undefined)
                                            .then(() => {
                                                townBank.loadBankAccount()
                                                    .then(account => {
                                                        $("#roleCash").text(account.cash + " GOLD");
                                                    });

                                                MessageBoard.publishMessage("旅途愉快，下次再见。");
                                                $("#eden_form").attr("action", "status.cgi");
                                                $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
                                                $("#returnButton").val(destinationTown.name + "欢迎您");
                                                $("#returnButton").prop("disabled", false);
                                            });
                                    });
                            });
                    });
            });
    });
}

export = CastlePostHouseProcessor;
