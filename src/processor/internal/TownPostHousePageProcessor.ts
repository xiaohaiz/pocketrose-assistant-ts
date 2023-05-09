import Castle from "../../common/Castle";
import Role from "../../common/Role";
import Town from "../../core/Town";
import TownLoader from "../../core/TownLoader";
import CastleEntrance from "../../pocket/CastleEntrance";
import CastleLoader from "../../pocket/CastleLoader";
import MapBuilder from "../../pocket/MapBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import TownBank from "../../pocket/TownBank";
import TownEntrance from "../../pocket/TownEntrance";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPostHousePageProcessor extends PageProcessorCredentialSupport {

    constructor() {
        super();
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
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
    $(td).attr("id", "title");
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
}

function doRenderEden(credential: Credential, lodgeExpense: number) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='town.cgi' method='post' id='lodgeForm'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='inn_gold' value='" + lodgeExpense + "'>";
    html += "<input type='hidden' name='mode' value='RECOVERY'>";
    html += "<input type='submit' id='lodgeSubmit'>";
    html += "</form>";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='returnForm'>";
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
    MapBuilder.updateTownBackgroundColor();

    new RoleLoader(credential).load()
        .then((role: Role) => {
            const town = role.town!;
            const buttonId = "location_" + town.coordinate.x + "_" + town.coordinate.y;
            $("#" + buttonId)
                .closest("td")
                .css("background-color", "black")
                .css("color", "yellow")
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

            // 绑定地图按钮事件
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
        let castleName = "";
        let confirmation;
        if (title.startsWith("城市")) {
            townName = StringUtils.substringAfterLast(title, " ");
            confirmation = confirm("确认移动到" + townName + "？");
        } else if (title.startsWith("城堡")) {
            castleName = StringUtils.substringAfterLast(title, " ");
            confirmation = confirm("确认回到" + castleName + "？");
        } else {
            confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
        }
        if (!confirmation) {
            return;
        }

        // 准备切换到移动模式
        document.getElementById("title")?.scrollIntoView();
        MessageBoard.resetMessageBoard("我们将实时为你播报旅途的动态：<br>");
        $("#lodgeButton")
            .prop("disabled", true)
            .hide();
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
        } else if (castleName !== "") {
            const castle = new Castle();
            castle.name = castleName;
            castle.coordinate = coordinate;
            doTravelToCastle(credential, castle);
        } else {
            doTravelToLocation(credential, coordinate);
        }
    });
}

function doTravelToTown(credential: Credential, town: Town) {
    MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + town.name + "</span>");
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + town.coordinate.asText() + "</span>");

    const bank = new TownBank(credential);
    // 支取10万城门税
    bank.withdraw(10)
        .then(success => {
            if (!success) {
                MessageBoard.publishWarning("因为没有足够的保证金，旅途被中断！");
                MessageBoard.publishMessage("回去吧，没钱就别来了。");
                $("#returnButton").val("请攒够钱再来");
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
                    plan.destination = town.coordinate;
                    const executor = new TravelPlanExecutor(plan);
                    // 执行旅途计划
                    executor.execute()
                        .then(() => {
                            // 进入目标城市
                            entrance.enter(town.id)
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
                                            $("#returnButton").val(town.name + "欢迎您");
                                            $("#returnButton").prop("disabled", false);
                                        });
                                });
                        });
                });
        });
}

function doTravelToCastle(credential: Credential, castle: Castle) {
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
                            $("#returnForm")
                                .attr("action", "castlestatus.cgi")
                                .find("input:hidden[value='STATUS']")
                                .val("CASTLESTATUS");
                            MessageBoard.publishMessage("旅途愉快，下次再见。");
                            $("#returnButton")
                                .prop("disabled", false)
                                .val("欢迎您回到" + castle.name);
                        });
                });
        });
}

function doTravelToLocation(credential: Credential, location: Coordinate) {
    MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

    new TownEntrance(credential).leave()
        .then(plan => {
            plan.destination = location;
            const executor = new TravelPlanExecutor(plan);
            executor.execute()
                .then(() => {
                    MessageBoard.publishMessage("旅途愉快，下次再见。");
                    $("#returnButton")
                        .prop("disabled", false)
                        .val("到达了目的地" + location.asText());
                });
        });
}

export = TownPostHousePageProcessor;