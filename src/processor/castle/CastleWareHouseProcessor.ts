import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";

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
            "<tr style='display:none'><td></td></tr>" +
            "<tr style='display:none'><td></td></tr>");
    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "white")
        .text("请管理您的城堡仓库。");

    doRender(credential, personalEquipmentList, storageEquipmentList);
}

function doRender(credential: Credential,
                  personalEquipmentList: Equipment[],
                  storageEquipmentList: Equipment[]) {

}

export = CastleWareHouseProcessor;