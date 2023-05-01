import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownLoader from "../../pocket/TownLoader";
import TownBank from "../../pocket/TownBank";
import TownEntrance from "../../pocket/TownEntrance";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";
import Castle from "../../pocket/Castle";
import CastleEntrance from "../../pocket/CastleEntrance";
import MapBuilder from "../../pocket/MapBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import Role from "../../pocket/Role";
import StringUtils from "../../util/StringUtils";
import CastleLoader from "../../pocket/CastleLoader";

class TownPostHouseProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }
}

function doProcess(credential: Credential): void {
    // 记录原有表单上的住宿费用
    const lodgeExpense = $("input:hidden[name='inn_gold']").val() as string;

    const t1 = $("table:eq(1)");
    const t4 = $("table:eq(4)");
    const t5 = $("table:eq(5)");

    // 修改标题
    let td = $(t1).find("tr:first td:first");
    $(td).removeAttr("bgcolor");
    $(td).removeAttr("width");
    $(td).removeAttr("height");
    $(td).css("text-align", "center");
    $(td).css("font-size", "150%");
    $(td).css("font-weight", "bold");
    $(td).css("background-color", "navy");
    $(td).css("color", "yellowgreen");
    $(td).text("＜＜  宿 屋 & 驿 站  ＞＞");

    // 标记现金栏、增加坐标栏和计时器
    const player = $(t4).find("tr:eq(1) td:first").text();
    let tr = $(t4).find("tr:last");
    td = $(tr).find("td:last");
    $(td).attr("id", "roleCash");
    $(tr).after($("<tr>" +
        "<td style='background-color:#E0D0B0'>坐标点</td>" +
        "<td style='background-color:#E8E8D0;text-align:right' id='roleLocation' colspan='3'>-</td>" +
        "</tr>" +
        "<tr>" +
        "<td style='background-color:#E0D0B0'>计时器</td>" +
        "<td style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' id='countDownTimer' colspan='3'>-</td>" +
        "</tr>"));

    // 创建消息面板
    td = $(t5).find("tr:first td:first");
    $(td).attr("id", "messageBoard");
    $(td).css("color", "white");

    // 增加扩展驿站面板
    tr = $(t1).find("tr:last");
    $(tr).find("td:first")
        .removeAttr("bgcolor")
        .removeAttr("align")
        .css("background-color", "#F8F0E0")
        .css("text-align", "center")
        .attr("id", "menu");
    $(tr).after($("" +
        "<tr style='display:none'>" +
        "<td id='eden'>" +
        "</td>" +
        "</tr>" +
        "<tr style='display:none'>" +
        "<td id='map' style='background-color:#F8F0E0;text-align:center'>" +
        "</td>" +
        "</tr>"));

    doRenderEden(credential, parseInt(lodgeExpense));
    doRenderMenu();
    doRenderMap(credential, player);

    console.log(PageUtils.currentPageHtml());

    // $(tr).after($("<tr>" +
    //     "<td style='background-color:#F8F0E0;text-align:center'>" +
    //     TownSelectionBuilder.buildTownSelectionTable() +
    //     "</td>" +
    //     "</tr>" +
    //     "<tr>" +
    //     "<td style='background-color:#F8F0E0;text-align:center'>" +
    //     "<input type='button' id='townButton' value='开始旅途' style='color:blue'>" +
    //     "<input type='button' id='castleButton' value='回到城堡' style='color:red'>" +
    //     "</td>" +
    //     "</tr>"));
    //
    // $("#townButton").prop("disabled", true);
    // $("#castleButton").prop("disabled", true);
    // $("#castleButton").hide();
    //
    // new RoleLoader(credential).load()
    //     .then(role => {
    //         const currentTown = (role as Role).town!;
    //         $("input:radio[value='" + currentTown.id + "']").prop("disabled", true);
    //         $("#townButton").prop("disabled", false);
    //         doBindTownButton(credential);
    //     });
    //
    // CastleLoader.loadCastle(player)
    //     .then(castle => {
    //         if (castle !== null) {
    //             $("#castleButton").show();
    //             $("#castleButton").val("回到" + castle.name);
    //             $("#castleButton").prop("disabled", false);
    //             doBindCastleButton(credential, castle);
    //         }
    //     });
}

function doRenderEden(credential: Credential, lodgeExpense: number) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='town.cgi' method='post'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='inn_gold' value='" + lodgeExpense + "'>";
    html += "<input type='hidden' name='mode' value='RECOVERY'>";
    html += "<input type='submit' id='lodgeSubmit'>";
    html += "</form>";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    html += "</form>";
    $("#eden").html(html);
}

function doRenderMenu() {
    $("#menu").html("" +
        "<input type='button' id='lodgeButton' value='宿泊'>" +
        "<input type='button' id='returnButton' value='返回城市'>"
    );
    $("#lodgeButton").on("click", function () {
        $("#lodgeSubmit").trigger("click");
    });
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRenderMap(credential: Credential, player: string) {
    const html = MapBuilder.buildMapTable();
    $("#map").html(html);

    new RoleLoader(credential).load()
        .then((role: Role) => {
            const town = role.town!;
            const buttonId = "location_" + town.coordinate.x + "_" + town.coordinate.y;
            $("#" + buttonId)
                .closest("td")
                .css("background-color", "black")
                .css("color", "white")
                .css("text-align", "center")
                .html($("#" + buttonId).val() as string);

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

            // 显示地图
            $("#map").parent().show();

            // 如果有必要的话绘制城堡
            CastleLoader.loadCastle(player)
                .then(castle => {
                    if (castle === null) {
                        return;
                    }
                    const coordinate = castle.coordinate!;
                    const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                    $("#" + buttonId)
                        .attr("value", "堡")
                        .css("background-color", "fuchsia")
                        .parent()
                        .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                        .attr("class", "color_fuchsia");
                });
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
        $("#lodgeButton").parent().remove();
        $("#returnButton").prop("disabled", true);
        $("#townButton").prop("disabled", true);
        $("#townButton").css("color", "grey");
        $("#castleButton").prop("disabled", true);
        $("#castleButton").css("color", "grey");
        $("input:radio").prop("disabled", true);

        const destinationTown = TownLoader.getTownById(destinationTownId as string)!;
        MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + destinationTown.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + destinationTown.coordinate.asText() + "</span>");

        const bank = new TownBank(credential);
        // 支取10万城门税
        bank.withdraw(10)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("因为没有足够的保证金，旅途被中断！");
                    MessageBoard.publishMessage("回去吧，没钱就别来了。");
                    $("#returnButton").prop("disabled", false);
                    return;
                }

                // 更新现金栏
                bank.loadBankAccount()
                    .then(account => {
                        $("#roleCash").text(account.cash + " GOLD");
                    });

                const entrance = new TownEntrance(credential);
                // 离开当前城市
                entrance.leave()
                    .then(plan => {
                        plan.destination = destinationTown.coordinate;
                        const executor = new TravelPlanExecutor(plan);
                        // 执行旅途计划
                        executor.execute()
                            .then(() => {
                                // 进入目标城市
                                entrance.enter(destinationTown.id)
                                    .then(() => {
                                        // 把身上现金全部存入
                                        bank.deposit(undefined)
                                            .then(() => {
                                                // 更新现金栏
                                                bank.loadBankAccount()
                                                    .then(account => {
                                                        $("#roleCash").text(account.cash + " GOLD");
                                                    });

                                                MessageBoard.publishMessage("旅途愉快，下次再见。");
                                                $("#returnButton").val(destinationTown.name + "欢迎您");
                                                $("#returnButton").prop("disabled", false);
                                            });
                                    });
                            });
                    });
            });
    });
}

function doBindCastleButton(credential: Credential, castle: Castle) {
    $("#castleButton").on("click", function () {
        MessageBoard.resetMessageBoard("我们将实时为你播报旅途的动态：<br>");
        $("#lodgeButton").parent().remove();
        $("#returnButton").prop("disabled", true);
        $("#townButton").prop("disabled", true);
        $("#townButton").css("color", "grey");
        $("#castleButton").prop("disabled", true);
        $("#castleButton").css("color", "grey");
        $("input:radio").prop("disabled", true);

        MessageBoard.publishMessage("目的地城堡：<span style='color:greenyellow'>" + castle.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + castle.coordinate!.asText() + "</span>");

        const entrance = new TownEntrance(credential);
        entrance.leave()
            .then(plan => {
                plan.destination = castle.coordinate;
                const executor = new TravelPlanExecutor(plan);
                executor.execute()
                    .then(() => {
                        const entrance = new CastleEntrance(credential);
                        entrance.enter()
                            .then(() => {
                                $("form[action='status.cgi']").attr("action", "castlestatus.cgi");
                                $("input:hidden[value='STATUS']").attr("value", "CASTLESTATUS");
                                MessageBoard.publishMessage("旅途愉快，下次再见。");
                                $("#returnButton").val("欢迎您回到" + castle.name);
                                $("#returnButton").prop("disabled", false);
                            });
                    });
            });
    });
}

export = TownPostHouseProcessor;