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
        await renderPage(page, town!);
    }

}

async function renderPage(page: TownForgePage, town: Town) {
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
        .html((idx, eh) => {
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
}

export = TownForgePageProcessor;