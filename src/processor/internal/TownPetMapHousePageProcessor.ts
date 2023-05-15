import TownLoader from "../../core/TownLoader";
import TownPetMapHouse from "../../pocketrose/TownPetMapHouse";
import TownPetMapHousePage from "../../pocketrose/TownPetMapHousePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPetMapHousePageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [35];
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownPetMapHouse.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
    }

    #renderImmutablePage(credential: Credential, page: TownPetMapHousePage, context?: PageProcessorContext) {
        let html = $("body:first").html();
        html = html.replace("\n\n\n收集图鉴一览：\n", "");
        $("body:first").html(html);

        // 删除所有的表单
        $("form").remove();
        $("input:hidden").remove();

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "180%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  宠 物 图 鉴  ＞＞")
            .parent()
            .attr("id", "tr0")
            .next()
            .attr("id", "tr1")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        $("#tr1")
            .next()
            .attr("id", "tr2")
            .css("display", "none")
            .html("<td id='returnFormContainer'></td>");
        $("#returnFormContainer").html(PageUtils.generateReturnTownForm(credential));

        $("#tr2")
            .after("<tr id='tr3'><td id='pageMenuContainer' style='text-align:center'></td></tr>");
        let returnTitle = "返回城市";
        const townId = context?.get("townId");
        if (townId !== undefined) {
            const town = TownLoader.getTownById(townId)!;
            returnTitle = "返回" + town.name;
        }
        html = "";
        html += "<button role='button' class='button-35' id='returnButton'>" + returnTitle + "</button>";
        $("#pageMenuContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });

        const petIdText = page.asText();
        if (petIdText !== "") {
            let html = $("#messageBoard").html();
            html += "<br>" + petIdText;
            $("#messageBoard").html(html);
        }

        $("table:eq(2)")
            .attr("id", "t1")
            .css("width", "100%");
    }

}

export = TownPetMapHousePageProcessor;