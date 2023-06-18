import TownForgePage from "../../core/forge/TownForgePage";
import TownForgePageParser from "../../core/forge/TownForgePageParser";
import Town from "../../core/town/Town";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownForgePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await TownForgePageParser.parse(PageUtils.currentPageHtml());
        const town = TownLoader.load(context?.get("townId"));
        await renderPage(credential, page, town!);
        await renderEquipmentList(credential, page);
    }

}

async function renderPage(credential: Credential, page: TownForgePage, town: Town) {
    $("table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .attr("id", "tr0")
        .find("> td:first")
        .attr("id", "pageTitle")
        .removeAttr("bgcolor")
        .removeAttr("width")
        .removeAttr("height")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜ " + town.nameTitle + " 锻 冶 屋  ＞＞")
        .parent()
        .next()
        .attr("id", "tr1")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:last")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:eq(2)")
        .find("> td:last")
        .html(() => {
            return "<span id='roleCash'>" + page.role.cash + "</span> GOLD";
        });
    $("#tr1")
        .next()
        .attr("id", "tr2")
        .find("> td:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .attr("id", "messageBoard")
        .removeAttr("bgcolor")
        .css("background-color", "black")
        .css("color", "white")
        .next()
        .attr("id", "messageBoardManager");
    $("#tr2")
        .next()
        .attr("id", "tr3")
        .find("> td:first")
        .attr("id", "equipmentList")
        .html("");
    $("#tr3")
        .next()
        .attr("id", "tr4")
        .find("> td:first")
        .css("text-align", "center")
        .html("" +
            "<div id='hidden-1' style='display:none'>" + PageUtils.generateReturnTownForm(credential) + "</div>" +
            "<button role='button' id='returnButton'>返回" + town.name + "</button>" +
            "");
    $("#returnButton").on("click", () => {
        $("#returnTown").trigger("click");
    });
}

async function renderEquipmentList(credential: Credential, page: TownForgePage) {

}

export = TownForgePageProcessor;