import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import TreasureHintParser from "../../pocket/TreasureHintParser";
import TreasureHint from "../../pocket/TreasureHint";
import NpcLoader from "../../pocket/NpcLoader";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownBank from "../../pocket/TownBank";
import MapBuilder from "../../pocket/MapBuilder";
import StringUtils from "../../util/StringUtils";

class TownAdventureGuildProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const treasureHintList = TreasureHintParser.parseTreasureHintList(this.pageHtml);
        doProcess(credential, treasureHintList);
    }

}

function doProcess(credential: Credential, treasureHintList: TreasureHint[]) {
    const t1 = $("table:eq(1)");
    const t3 = $("table:eq(3)");
    const t4 = $("table:eq(4)");

    $(t1).find("td:first")
        .removeAttr("bgcolor")
        .removeAttr("width")
        .removeAttr("height")
        .css("width", "100%")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .attr("id", "title")
        .text("＜＜  冒 险 家 公 会  ＞＞");

    $(t3).find("tr:last td:eq(1)")
        .attr("id", "roleCash");
    $(t3).find("tr:last")
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td id='roleLocation' style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' colspan='3'>-</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>计时器</td>" +
            "<td id='countDownTimer' style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' colspan='3'>-</td>" +
            "</tr>"
        ));

    $(t4).find("td:first")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .attr("id", "messageBoard")
        .next()
        .html(NpcLoader.getNpcImageHtml("花子")!);
    MessageBoard.resetMessageBoard("S、S、SHIT，隔壁驿站推出了新的业务，抢、抢走了我的生意，幸亏挖宝的还得来我这儿！");

    $("form:first").parent()
        .attr("id", "treasureHint")
        .parent()
        .css("display", "none")
        .after($("" +
            "<tr style='display:none'>" +
            "<td id='eden' style='width:100%'></td>" +
            "</tr>" +
            "<tr>" +
            "<td id='menu' style='width:100%;background-color:#E8E8D0;text-align:center'></td>" +
            "</tr>"
        ));

    // 清空之前的藏宝图交换的表单
    $("#treasureHint").html("");

    doRenderEden(credential);
    doRenderMenu();
    doRenderTreasureHint(credential, treasureHintList);
}

function doRenderEden(credential: Credential) {
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

function doRenderMenu() {
    let html = "";
    html += "<input type='button' value='重置消息面板' id='resetButton'>";
    html += "<input type='button' value='离开冒险家公会' id='returnButton'>";
    $("#menu").html(html);

    $("#resetButton").on("click", function () {
        MessageBoard.resetMessageBoard("");
    });
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRenderTreasureHint(credential: Credential, treasureHintList: TreasureHint[]) {
    if (treasureHintList.length === 0) {
        return;
    }
    let html = "";
    html += "<table style='border-width:0;text-align:center'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='width:100%'>";
    html += "<table style='background-color:#888888;margin:auto;border-width:0;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>选择</th>";
    html += "<th style='background-color:#F8F0E0'>物品</th>";
    html += "<th style='background-color:#EFE0C0'>X坐标</th>";
    html += "<th style='background-color:#E0D0B0'>Y坐标</th>";
    html += "<th style='background-color:#EFE0C0'>备注</th>";
    html += "</tr>";
    let rowIndex = 0;
    for (const treasureHint of treasureHintList) {
        html += "<tr class='treasure_hint_class' id='row_" + (rowIndex++) + "'>";
        html += "<td style='background-color:#E8E8D0'><input type='checkbox' name='item" + treasureHint.index + "' value='" + treasureHint.index + "'></td>";
        html += "<td style='background-color:#F8F0E0'>" + treasureHint.name + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + treasureHint.coordinate?.x + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + treasureHint.coordinate?.y + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + treasureHint.commentHtml + "</td>";
        html += "</tr>";
    }
    html += "<tr>";
    html += "<td colspan='5'>";
    html += "<input type='button' value='更换藏宝图' id='exchangeButton'>";
    html += "<input type='button' value='藏宝图探险' id='treasureButton'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "<td>";
    html += MapBuilder.buildMapTable();
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#treasureHint")
        .html(html)
        .parent()
        .show();

    $(".treasure_hint_class")
        .on("mouseenter", function () {
            const x = parseInt($(this).find("td:eq(2)").text());
            const y = parseInt($(this).find("td:eq(3)").text());
            const mapId = "location_" + x + "_" + y;
            $("#" + mapId).css("background-color", "blue");
        })
        .on("mouseleave", function () {
            const x = parseInt($(this).find("td:eq(2)").text());
            const y = parseInt($(this).find("td:eq(3)").text());
            const mapId = "location_" + x + "_" + y;
            const s = $("#" + mapId).parent().attr("class")!;
            const c = StringUtils.substringAfter(s, "_");
            if (c !== "none") {
                $("#" + mapId).css("background-color", c);
            } else {
                $("#" + mapId).removeAttr("style");
            }
        });

    doBindExchangeButton(credential);
    doBindTreasureButton(credential);
}

function doBindExchangeButton(credential: Credential) {
    $("#exchangeButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $("input:checkbox:checked").each(function (_idx, checkbox) {
            const name = $(checkbox).attr("name") as string;
            const value = $(checkbox).val() as string;
            checkedCount++;
            // @ts-ignore
            request[name] = value;
        });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("没有选择藏宝图！");
            return;
        }
        // @ts-ignore
        request["mode"] = "CHANGEMAP2";
        const bank = new TownBank(credential);
        bank.withdraw(10)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱你就回吧，晦气！");
                    return;
                }
                doUpdateRoleCash(credential);
                NetworkUtils.sendPostRequest("town.cgi", request, function () {
                    MessageBoard.publishMessage("交换藏宝图成功。");
                    bank.deposit(undefined)
                        .then(() => {
                            doUpdateRoleCash(credential);
                            doRefresh(credential);
                        });
                });
            });
    });
}

function doBindTreasureButton(credential: Credential) {
    $("#treasureButton").on("click", function () {

    });
}

function doRefresh(credential: Credential) {
    $("#treasureHint").parent().hide();
    $("#exchangeButton").off("click");
    $("#treasureButton").off("click");
    $(".treasure_hint_class")
        .off("mouseenter")
        .off("mouseleave");
    const request = credential.asRequest();
    // @ts-ignore
    request["con_str"] = "50";
    // @ts-ignore
    request["mode"] = "CHANGEMAP";
    NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
        const hints = TreasureHintParser.parseTreasureHintList(html);
        doRenderTreasureHint(credential, hints);
    });
}

function doUpdateRoleCash(credential: Credential) {
    new TownBank(credential).loadBankAccount()
        .then(account => {
            $("#roleCash").text(account.cash + " GOLD");
        });
}

export = TownAdventureGuildProcessor;