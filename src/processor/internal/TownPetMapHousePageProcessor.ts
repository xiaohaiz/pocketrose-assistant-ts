import TownPetMapHouse from "../../pocketrose/TownPetMapHouse";
import TownPetMapHousePage from "../../pocketrose/TownPetMapHousePage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPetMapHousePageProcessor extends PageProcessorCredentialSupport {


    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownPetMapHouse.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
    }

    #renderImmutablePage(credential: Credential, page: TownPetMapHousePage, context?: PageProcessorContext) {
        let html = $("body:first").html();
        html = html.replace("\n\n\n收集图鉴一览：\n", "");
        $("body:first").html(html);

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
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

        const petIdText = page.asText();
        if (petIdText !== "") {
            let html = $("#messageBoard").html();
            html += "<br>" + petIdText;
            $("#messageBoard").html(html);
        }
    }

}

export = TownPetMapHousePageProcessor;