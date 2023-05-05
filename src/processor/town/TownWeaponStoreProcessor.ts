import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownWeaponStore from "../../pocket/store/TownWeaponStore";
import TownLoader from "../../pocket/TownLoader";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import MessageBoard from "../../util/MessageBoard";
import TownWeaponStorePage from "../../pocket/store/TownWeaponStorePage";

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
        .html("倍“锋”来袭,特“利”独行。")
        .next()
        .attr("id", "messageBoardManager");

    // 清空原来的商品栏，保留行作为新的UI的位置
    t1.find("tr:first")
        .next()
        .next()
        .next()
        .html("<td id='weapon_store_UI' style='width:100%;background-color:#F8F0E0'></td>");

    // 绘制新的内容
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
    html += "<tbody>";
    // ------------------------------------------------------------------------
    // 隐藏的表单
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 主菜单
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refresh_button' value='刷新武器屋'>";
    html += "<input type='button' id='return_button' value='离开武器屋'>";
    html += "</td>";
    // ------------------------------------------------------------------------
    // 个人物品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='personal_equipment_list_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 武器屋商品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='weapon_merchandise_list_cell'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#weapon_store_UI").html(html);

    doGenerateHiddenForm(page.credential);
    doBindReturnButton();
    doBindRefreshButton(page);

    doRender(page);
}

function doGenerateHiddenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='return_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='return_submit'>";
    html += "</form>";
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doRefresh(page: TownWeaponStorePage) {
    document.getElementById("title_cell")?.scrollIntoView();
    $("#personal_equipment_list_cell").parent().hide();
    $("#weapon_merchandise_list_cell").parent().hide();
    $(".dynamic_button_class").off("click");
    new TownWeaponStore(page.credential, page.townId).enter()
        .then(page => {
            const roleCash = page.roleCash!;
            $("#roleCash").text(roleCash + " GOLD");
            doRender(page);
        });
}

function doBindRefreshButton(page: TownWeaponStorePage) {
    $("#refresh_button").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
        MessageBoard.resetMessageBoard("倍“锋”来袭,特“利”独行。");
        doRefresh(page);
    });
}

function doRender(page: TownWeaponStorePage) {
}

export = TownWeaponStoreProcessor;