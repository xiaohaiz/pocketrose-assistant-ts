import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import TownArmorHouse from "../../pocketrose/TownArmorHouse";
import TownArmorHousePage from "../../pocketrose/TownArmorHousePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownArmorHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownArmorHouse.parsePage(PageUtils.currentPageHtml());
        const town = TownLoader.getTownById(page.townId!)!;
        this.#renderImmutablePage(credential, page);
        this.#renderMutablePage(credential, page);
    }

    #renderImmutablePage(credential: Credential, page: TownArmorHousePage) {
        // 重新绘制页面框架
        $("table:eq(1)")
            .attr("id", "t1")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  " + page.town.nameTitle + " 防 具 屋  ＞＞")
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
        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .find("table:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        // 清空原来的商品栏，保留行作为新的UI的位置
        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .next()
            .html("<td id='armor_store_UI' style='width:100%;background-color:#F8F0E0'></td>");

        // 绘制新的内容
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody>";
        // ------------------------------------------------------------------------
        // 隐藏的表单
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='hidden_form_cell'>";
        html += PageUtils.generateReturnTownForm(credential);
        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='town' value='" + page.town.id + "'>";
        html += "<input type='hidden' name='mode' value='USE_ITEM'>";
        html += "<input type='submit' id='equipmentManagement'>";
        html += "</form>";
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 主菜单
        // ------------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<input type='button' id='refresh_button' value='刷新" + page.town.name + "防具屋'>";
        html += "<input type='button' id='return_button' value='离开" + page.town.name + "防具屋'>";
        html += "<input type='button' id='equipment_button' value='转到装备管理'>";
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
        html += "<td id='armor_merchandise_list_cell'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#armor_store_UI").html(html);

        this.#bindImmutableButtons(credential, page.town.id);
    }

    #bindImmutableButtons(credential: Credential, townId: string) {
        $("#refresh_button").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            this.#refreshMutablePage(credential, townId);
        });
        $("#return_button").on("click", () => {
            $("#returnTown").trigger("click");
        });
        $("#equipment_button").on("click", () => {
            $("#equipmentManagement").trigger("click");
        });
    }

    #renderMutablePage(credential: Credential, page: TownArmorHousePage) {
        this.#bindMutableButtons(credential, page);
    }

    #bindMutableButtons(credential: Credential, page: TownArmorHousePage) {
    }

    #refreshMutablePage(credential: Credential, townId: string) {
        new TownArmorHouse(credential, townId).open().then(page => {
            this.#renderMutablePage(credential, page);
        });
    }
}

export = TownArmorHousePageProcessor;