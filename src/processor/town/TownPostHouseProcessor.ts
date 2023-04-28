import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import TownSelectionBuilder from "../../pocket/TownSelectionBuilder";
import RoleLoader from "../../pocket/RoleLoader";
import Role from "../../pocket/Role";

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
    const t3 = $("table:eq(3)");
    const t4 = $("table:eq(4)");

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

    // 标记现金栏、增加计时器
    let tr = $(t3).find("tr:last");
    td = $(tr).find("td:last");
    $(td).attr("id", "roleCash");
    $(tr).after($("<tr>" +
        "<td style='background-color:#E0D0B0'>计时器</td>" +
        "<td style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' id='countDownTimer' colspan='3'>-</td>" +
        "</tr>"));

    // 创建消息面板
    td = $(t4).find("tr:first td:first");
    $(td).attr("id", "messageBoard");
    $(td).attr("color", "white");

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
}

function doBindTownButton(credential: Credential) {
    $("#townButton").on("click", function () {
        $("#lodgeButton").parent().remove();
        $("#returnButton").hide();
        const destinationTownId = $("input:radio:checked").val();
        if (destinationTownId === undefined) {

        }
    });
}

function doBindCastleButton() {
}

export = TownPostHouseProcessor;