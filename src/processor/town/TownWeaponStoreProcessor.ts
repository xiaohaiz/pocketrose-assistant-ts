import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownWeaponStore from "../../pocket/store/TownWeaponStore";
import TownLoader from "../../pocket/TownLoader";

class TownWeaponStoreProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　武器屋　□　＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    const page = TownWeaponStore.parsePage(PageUtils.currentPageHtml());
    const town = TownLoader.getTownById(page.townId)!;

    // 重新绘制页面框架
    const t1 = $("table:eq(1)");
    t1.find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  " + town.nameTitle + " 武 器 屋  ＞＞")
        .parent()
        .next()
        .find("table:first")
        .find("td:eq(1)")
        .find("table:first")
        .find("td:last")
        .attr("id", "roleCash");

    // 删除原有页面所有的表单
    $("form").remove();

    // 消息面板
    t1.find("tr:first")
        .next()
        .next()
        .find("table:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .css("color", "white")
        .next()
        .attr("id", "messageBoardManager");

    // 清空原来的商品栏，保留行作为新的UI的位置
    t1.find("tr:first")
        .next()
        .next()
        .next()
        .attr("id", "weapon_store_UI")
        .html("");

    console.log(PageUtils.currentPageHtml());
}

export = TownWeaponStoreProcessor;