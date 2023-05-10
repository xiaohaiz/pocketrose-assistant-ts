import TownAccessoryHouse from "../../pocketrose/TownAccessoryHouse";
import TownAccessoryHousePage from "../../pocketrose/TownAccessoryHousePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownAccessoryHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        PageUtils.loadButtonStyle(7);
        PageUtils.loadButtonStyle(8);
        PageUtils.loadButtonStyle(35);

        const page = TownAccessoryHouse.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page);
    }

    #renderImmutablePage(credential: Credential, page: TownAccessoryHousePage) {
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
            .text("＜＜  " + page.town.nameTitle + " 饰 品 屋  ＞＞")
            .parent()
            .next()
            .find("table:first")
            .find("td:eq(1)")
            .find("table:first")
            .find("td:last")
            .attr("id", "roleCash");

        $("form").remove();

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

        $("#t1")
            .find("tr:first")
            .next()
            .next()
            .next()
            .html("<td id='storeUI' style='width:100%;background-color:#F8F0E0'></td>");

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
        html += "<input type='button' id='refreshButton' value='刷新" + page.town.name + "饰品屋' class='button-35'>&nbsp;";
        html += "<input type='button' id='returnButton' value='离开" + page.town.name + "饰品屋' class='button-35'>&nbsp;";
        html += "<input type='button' id='equipmentButton' value='转到装备管理' class='button-35'>";
        html += "</td>";
        // ------------------------------------------------------------------------
        // 个人物品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='equipmentList'></td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 饰品屋商品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='merchandiseList'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#storeUI").html(html);
    }
}

export = TownAccessoryHousePageProcessor;