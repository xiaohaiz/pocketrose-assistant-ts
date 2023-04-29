import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import TownSelectionBuilder from "../../pocket/TownSelectionBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import Role from "../../pocket/Role";
import MessageBoard from "../../util/MessageBoard";
import TownLoader from "../../pocket/TownLoader";
import TownBank from "../../pocket/TownBank";
import TownEntrance from "../../pocket/TownEntrance";
import TravelPlanExecutor from "../../pocket/TravelPlanExecutor";
import CastleLoader from "../../pocket/CastleLoader";
import Castle from "../../pocket/Castle";

class TownPostHouseProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }
}

function doProcess(credential: Credential): void {
    $("input:submit[value='宿泊']").attr("id", "lodgeButton");
    $("input:submit[value='返回城市']").attr("id", "returnButton");

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

    // 增加驿站面板
    tr = $(t1).find("tr:last");
    $(tr).after($("<tr>" +
        "<td style='background-color:#F8F0E0;text-align:center'>" +
        TownSelectionBuilder.buildTownSelectionTable() +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td style='background-color:#F8F0E0;text-align:center'>" +
        "<input type='button' id='townButton' value='开始旅途' style='color:blue'>" +
        "<input type='button' id='castleButton' value='回到城堡' style='color:red'>" +
        "</td>" +
        "</tr>"));

    $("#townButton").prop("disabled", true);
    $("#castleButton").prop("disabled", true);
    $("#castleButton").hide();

    new RoleLoader(credential).load()
        .then(role => {
            const currentTown = (role as Role).town!;
            $("input:radio[value='" + currentTown.id + "']").prop("disabled", true);
            $("#townButton").prop("disabled", false);
            doBindTownButton(credential);
        });

    CastleLoader.loadCastle(player)
        .then(castle => {
            if (castle !== null) {
                $("#castleButton").show();
                $("#castleButton").val("回到" + castle.name);
                $("#castleButton").prop("disabled", false);
                doBindCastleButton(credential, castle);
            }
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

                const roleLoader = new RoleLoader(credential);
                // 更新现金栏
                roleLoader.load()
                    .then(role => {
                        const cash = role.cash;
                        $("#roleCash").text(cash + " GOLD");
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
                                                roleLoader.load()
                                                    .then(role => {
                                                        const cash = role.cash;
                                                        $("#roleCash").text(cash + " GOLD");
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
                    });
            });
    });
}

export = TownPostHouseProcessor;