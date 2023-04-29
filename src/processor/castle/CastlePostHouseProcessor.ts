import PageProcessor from "../PageProcessor";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import TownSelectionBuilder from "../../pocket/TownSelectionBuilder";
import TownLoader from "../../pocket/TownLoader";
import CastleBank from "../../pocket/CastleBank";

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
    $(td).text("＜＜  城 堡 驿 站  ＞＞");

    // 现金栏、坐标点、计时器
    td = $(t2).find("tr:eq(2) td:last");
    $(td).attr("id", "roleCash");
    let tr = $(t2).find("tr:eq(3)");
    td = $(tr).find("td:first");
    $(td).text("坐标点");
    td = $(tr).find("td:last");
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

    $(tr).after($(doGenerate(credential)));

    doBindReturnButton();
    doBindTownButton(credential);
}

function doGenerate(credential: Credential): string {
    let html = "";
    html += "<tr style='display:none'>";
    html += "<td>";
    html += "<form action='' method='post' id='eden_form'>"
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<div id='eden_form_payload' style='display:none'></div>";
    html += "<input type='submit' id='eden_form_submit'>";
    html += "</form>"
    html += "</td>";
    html += "</tr>";
    html += "<tr style='background-color:#F8F0E0;text-align:center'>";
    html += "<td>";
    html += "<input type='button' id='returnButton' value='返回城堡'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr style='background-color:#F8F0E0;text-align:center'>";
    html += "<td>";
    html += TownSelectionBuilder.buildTownSelectionTable();
    html += "</td>";
    html += "</tr>";
    html += "<tr style='background-color:#F8F0E0;text-align:center'>";
    html += "<td>";
    html += "<input type='button' id='townButton' value='开始旅途' style='color:blue'>";
    html += "</td>";
    html += "</tr>";
    return html;
}

function doBindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "castlestatus.cgi");
        $("#eden_form_submit").html("<input type='hidden' name='mode' value='CASTLESTATUS'>");
        $("#eden_form_submit").trigger("click");
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


            });
    });
}

export = CastlePostHouseProcessor;
