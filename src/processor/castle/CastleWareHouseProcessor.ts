import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";
import NetworkUtils from "../../util/NetworkUtils";

class CastleWareHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡仓库　|||　＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        PageUtils.fixCurrentPageBrokerImages();
        doProcess();
    }

}

function doProcess() {
    const credential = PageUtils.currentCredential();
    const pageHtml = PageUtils.currentPageHtml();
    const personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
    const storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);

    // 修改标题
    $("td:first")
        .attr("id", "title")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  城 堡 仓 库  ＞＞");

    // 创建消息面板
    $("tr:first")
        .next()
        .after("" +
            "<tr><td id='messageBoardContainer' style='background-color:#E8E8D0'></td></tr>" +
            "<tr style='display:none'><td id='eden'></td></tr>" +
            "<tr style='display:none'><td></td></tr>");
    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "white")
        .text("请管理您的城堡仓库。");

    // 重新布局页面
    // 删除之前的全部表单，会连带删除表单内的表格
    $("form").remove();
    $("h3").remove();
    $("hr")
        .filter(function (_idx) {
            return _idx !== 3;
        })
        .each(function (_idx, hr) {
            hr.remove();
        });

    // 准备新的界面
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888'>";
    html += "<tbody>";
    html += "<tr style='display:none'>";
    html += "<td id='personalEquipmentList'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='storageEquipmentList'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='returnButton' value='离开城堡仓库'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("table:first").after($(html));

    doGenerateEdenForm(credential);
    doBindReturnButton();

    console.log(PageUtils.currentPageHtml());

    doRender(credential, personalEquipmentList, storageEquipmentList);
}

function doGenerateEdenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='castlestatus.cgi' method='post' id='returnForm'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    html += "</form>";
    $("#eden").html(html);
}

function doBindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRender(credential: Credential,
                  personalEquipmentList: Equipment[],
                  storageEquipmentList: Equipment[]) {
    doRenderPersonalEquipmentList(credential, personalEquipmentList);
    doRenderStorageEquipmentList(credential, storageEquipmentList);
}

function doRenderPersonalEquipmentList(credential: Credential, personalEquipmentList: Equipment[]) {
}

function doRenderStorageEquipmentList(credential: Credential, personalEquipmentList: Equipment[]) {
}

function doRefresh(credential: Credential) {
    const request = credential.asRequest();
    // @ts-ignore
    request.mode = "CASTLE_ITEM";
    NetworkUtils.sendPostRequest("castle.cgi", request, function (pageHtml) {
        $("#personalEquipmentList")
            .html("")
            .parent()
            .hide();
        $("#storageEquipmentList")
            .html("")
            .parent()
            .hide();

        const personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
        const storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);
        doRender(credential, personalEquipmentList, storageEquipmentList);
    });
}

export = CastleWareHouseProcessor;