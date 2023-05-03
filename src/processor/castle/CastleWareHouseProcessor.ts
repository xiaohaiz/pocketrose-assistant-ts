import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";

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


}

export = CastleWareHouseProcessor;