import NpcLoader from "../../core/NpcLoader";
import TownItemHouse from "../../pocketrose/TownItemHouse";
import TownItemHousePage from "../../pocketrose/TownItemHousePage";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownItemHousePageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [35];
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownItemHouse.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page);
        this.#renderMutablePage(credential, page);
    }

    #renderImmutablePage(credential: Credential, page: TownItemHousePage) {
        $("table[height='100%']").removeAttr("height");

        $("table:first")
            .attr("id", "t0")
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
            .text("＜＜  " + page.town.nameTitle + " 物 品 屋  ＞＞")
            .parent()
            .next()
            .find("table:first")
            .find("td:eq(1)")
            .find("table:first")
            .find("td:last")
            .attr("id", "roleCash");

        $("form").remove();

        $("#t0")
            .find("tr:first")
            .next()
            .next()
            .find("table:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        $("#t0")
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
        html += "<input type='button' id='refreshButton' value='刷新" + page.town.name + "物品屋' class='button-35'>&nbsp;";
        html += "<input type='button' id='returnButton' value='离开" + page.town.name + "物品屋' class='button-35'>&nbsp;";
        html += "<input type='button' id='equipmentButton' value='转到装备管理' class='button-35'>";
        html += "</td>";
        // ------------------------------------------------------------------------
        // 个人物品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='equipmentList' style='text-align:center'></td>";
        html += "</tr>";
        // ------------------------------------------------------------------------
        // 商品栏
        // ------------------------------------------------------------------------
        html += "<tr style='display:none'>";
        html += "<td id='merchandiseList' style='text-align:center'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#storeUI").html(html);

        this.#bindImmutableButtons(credential, page.townId!);
    }

    #bindImmutableButtons(credential: Credential, townId: string) {
        $("#refreshButton").on("click", () => {
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            MessageBoard.resetMessageBoard("欢迎、欢迎。");
            this.#refreshMutablePage(credential, townId);
        });
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
        $("#equipmentButton").on("click", () => {
            $("#equipmentManagement").trigger("click");
        });
    }

    #renderMutablePage(credential: Credential, page: TownItemHousePage) {
    }

    #refreshMutablePage(credential: Credential, townId: string) {
        PageUtils.scrollIntoView("pageTitle");
        $("#equipmentList").parent().hide();
        $("#merchandiseList").parent().hide();
        $(".mutableButton").off("click");
        new TownItemHouse(credential, townId).open().then(page => {
            $("#roleCash").text(page.role!.cash! + " GOLD");
            this.#renderMutablePage(credential, page);
        });
    }
}

export = TownItemHousePageProcessor;