import TownForge from "../../core/forge/TownForge";
import TownForgePage from "../../core/forge/TownForgePage";
import TownForgePageParser from "../../core/forge/TownForgePageParser";
import NpcLoader from "../../core/role/NpcLoader";
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
        .html("" +
            "<div id='hidden-1' style='display:none'>" + PageUtils.generateReturnTownForm(credential) + "</div>" +
            "<button role='button' id='refreshButton'>刷新锻冶屋</button>" +
            "<button role='button' id='returnButton'>返回" + town.name + "</button>" +
            "");
    $("#tr3")
        .next()
        .attr("id", "tr4")
        .find("> td:first")
        .attr("id", "equipmentList")
        .css("text-align", "center")
        .html("");
    $("#refreshButton").on("click", () => {
        refreshPage(credential, town).then();
    });
    $("#returnButton").on("click", () => {
        $("#returnTown").trigger("click");
    });
}

async function renderEquipmentList(credential: Credential, page: TownForgePage) {
    let html = "";
    html += "<table style='margin:auto;background-color:#888888'>";
    html += "<thead>";
    html += "<tr>";
    html += "<th style='background-color:skyblue;'>装备</th>";
    html += "<th style='background-color:skyblue;'>所持物品</th>";
    html += "<th style='background-color:skyblue;'>种类</th>";
    html += "<th style='background-color:skyblue;'>威力</th>";
    html += "<th style='background-color:skyblue;'>重量</th>";
    html += "<th style='background-color:skyblue;'>耐久</th>";
    html += "<th style='background-color:skyblue;'>修理费</th>";
    html += "<th style='background-color:skyblue;'>修理</th>";
    html += "</tr>";
    for (const equipment of page.equipmentList) {
        if (!equipment.selectable!) {
            continue;
        }
        if (!equipment.isRepairable) {
            continue;
        }
        if (equipment.endure! === equipment.maxEndure!) {
            continue;
        }
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>" + equipment.usingHTML + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:center;font-weight:bold'>" + equipment.nameHTML + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>" + equipment.category + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:right'>" + equipment.power + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:right'>" + equipment.weight + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:right'>" + equipment.endureHtml + "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:right'>" + equipment.repairPrice + " GOLD</td>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>修理</td>";
        html += "</tr>";
    }
    html += "</thead>";
    html += "<tbody>";
    html += "</tbody>";
    html += "</table>";
    $("#equipmentList").html(html);
}

async function refreshPage(credential: Credential, town: Town) {
    const page = await new TownForge(credential, town.id).open();
    $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
    $(".repairButton").off("click");
    $("#roleCash").text(page.role.cash!);
    await renderEquipmentList(credential, page);
}

export = TownForgePageProcessor;