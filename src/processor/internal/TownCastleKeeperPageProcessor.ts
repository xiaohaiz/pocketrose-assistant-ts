import Castle from "../../common/Castle";
import Equipment from "../../common/Equipment";
import Pet from "../../common/Pet";
import NpcLoader from "../../core/NpcLoader";
import CastleLoader from "../../pocket/CastleLoader";
import CastleRanch from "../../pocketrose/CastleRanch";
import CastleWarehouse from "../../pocketrose/CastleWarehouse";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownCastleKeeperPageProcessor extends PageProcessorCredentialSupport {

    constructor() {
        super();
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        doProcess();
    }

}

function doProcess() {
    const credential = PageUtils.currentCredential();

    $("table:eq(1)")
        .attr("id", "t1")
        .find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  城 堡 管 家  ＞＞");

    $("#t1")
        .find("tr:first")
        .next()
        .find("table:first")
        .find("tr:first")
        .find("td:eq(3)")
        .find("table:first")
        .find("td:first")
        .find("table:first")
        .find("tr:first")
        .next()
        .find("td:first")
        .attr("id", "roleName")
        .parent()
        .next()
        .find("td:last")
        .attr("id", "roleCash");

    const roleName = $("#roleName").text();

    $("#t1")
        .find("tr:first")
        .next()
        .next()
        .find("td:first")
        .find("table:first")
        .find("tr:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .remove("width")
        .remove("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .text("")
        .next()
        .attr("id", "messageBoardManager")
        .remove("bgcolor")
        .css("background-color", "#F8F0E0")
        .html(NpcLoader.randomNpcImageHtml());

    // ------------------------------------------------------------------------
    // #castle_keeper_cell
    // ------------------------------------------------------------------------
    let html = "";
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='return_button' value='离开城堡管家'>";
    html += "</td>";
    html += "</tr>";

    $("#t1")
        .find("tr:first")
        .next()
        .next()
        .next()
        .css("display", "none")
        .find("td:first")
        .attr("id", "castle_keeper_cell")
        .html("")
        .parent()
        .after($(html));

    doGenerateHiddenForm(credential);
    doBindReturnButton();

    CastleLoader.loadCastle2(roleName)
        .then(castle => {
            doRender(credential, castle);
        })
        .catch(() => {
            MessageBoard.resetMessageBoard(
                "<b style='color:yellow;font-size:150%'>自己有没有城堡，你难道心里一点数都没有？</b>")
        });
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

function doRender(credential: Credential, castle: Castle) {
    MessageBoard.resetMessageBoard("我是城堡《" + castle.name + "》的管家，可以也仅可以为您查询城堡的库存信息。");

    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
    html += "<tbody>";
    // ------------------------------------------------------------------------
    // 城堡仓库栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='castle_warehouse_cell' style='background-color:#F8F0E0;text-align:center'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 城堡牧场栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='castle_ranch_cell' style='background-color:#F8F0E0;text-align:center'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#castle_keeper_cell")
        .html(html)
        .parent()
        .show();

    new CastleWarehouse(credential).open().then(page => {
        if (page.storageEquipmentList !== undefined && page.storageEquipmentList.length > 0) {
            const equipmentList: Equipment[] = [];
            equipmentList.push(...page.storageEquipmentList);

            equipmentList.sort((a, b) => {
                let ret = a.categoryOrder - b.categoryOrder;
                if (ret !== 0) {
                    return ret;
                }
                let a1 = a.star! ? 1 : 0;
                let b1 = b.star! ? 1 : 0;
                ret = a1 - b1;
                if (ret !== 0) {
                    return ret;
                }
                ret = b.power! - a.power!;
                if (ret !== 0) {
                    return ret;
                }
                ret = a.fullName!.localeCompare(b.fullName);
                if (ret !== 0) {
                    return ret;
                }
                return b.additionalPower! - a.additionalPower!;
            });

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='16'>";
            html += "＜ 城 堡 仓 库 ＞";
            html += "</td>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>种类</th>";
            html += "<th style='background-color:#E0D0B0'>效果</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#E0D0B0'>耐久</th>";
            html += "<th style='background-color:#EFE0C0'>职业</th>";
            html += "<th style='background-color:#E0D0B0'>攻击</th>";
            html += "<th style='background-color:#E0D0B0'>防御</th>";
            html += "<th style='background-color:#E0D0B0'>智力</th>";
            html += "<th style='background-color:#E0D0B0'>精神</th>";
            html += "<th style='background-color:#E0D0B0'>速度</th>";
            html += "<th style='background-color:#EFE0C0'>威力</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#EFE0C0'>幸运</th>";
            html += "<th style='background-color:#E0D0B0'>经验</th>";
            html += "<th style='background-color:#E0D0B0'>属性</th>";
            html += "</tr>";

            for (const equipment of equipmentList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.requiredCareerHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpeedHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.attributeHtml + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#castle_warehouse_cell").html(html).parent().show();
        }
    });

    new CastleRanch(credential).enter().then(page => {
        if (page.ranchPetList!.length > 0) {
            const petList: Pet[] = [];
            petList.push(...page.ranchPetList!);

            petList.sort((a, b) => {
                let ret = b.level! - a.level!;
                if (ret !== 0) {
                    return ret;
                }
                let a1 = (a.name!.includes("(") && a.name!.includes(")")) ? 0 : 1;
                let b1 = (b.name!.includes("(") && b.name!.includes(")")) ? 0 : 1;
                ret = a1 - b1;
                if (ret !== 0) {
                    return ret;
                }

                let a2 = (a.name!.includes("(") && a.name!.includes(")")) ?
                    StringUtils.substringBetween(a.name!, "(", ")") : a.name!;
                let b2 = (b.name!.includes("(") && b.name!.includes(")")) ?
                    StringUtils.substringBetween(b.name!, "(", ")") : b.name!;
                return a2.localeCompare(b2);
            });

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='10'>";
            html += "＜ 城 堡 牧 场 ＞";
            html += "</td>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>等级</th>";
            html += "<th style='background-color:#E0D0B0'>生命</th>";
            html += "<th style='background-color:#E0D0B0'>攻击</th>";
            html += "<th style='background-color:#E0D0B0'>防御</th>";
            html += "<th style='background-color:#E0D0B0'>智力</th>";
            html += "<th style='background-color:#E0D0B0'>精神</th>";
            html += "<th style='background-color:#E0D0B0'>速度</th>";
            html += "<th style='background-color:#EFE0C0'>经验</th>";
            html += "<th style='background-color:#EFE0C0'>性别</th>";
            html += "</tr>";

            for (const pet of petList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>" + pet.name + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + pet.levelHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.healthHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.attackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.defenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.specialAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.specialDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + pet.speedHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + pet.experienceHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + pet.gender + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#castle_ranch_cell").html(html).parent().show();
        }
    });
}

export = TownCastleKeeperPageProcessor;