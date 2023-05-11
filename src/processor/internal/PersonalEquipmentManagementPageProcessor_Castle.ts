import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Castle extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "＜＜  装 备 管 理 （ 城 堡 模 式 ）  ＞＞";
        } else {
            const castleName = context.get("castleName")!;
            return "＜＜  装 备 管 理 （ " + StringUtils.toTitleString(castleName) + " 城 堡 ）  ＞＞";
        }
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "城堡";
        } else {
            return context.get("castleName")!;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？真是一刻不得闲置啊。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void {
        const bag = page.findTreasureBag();
        if (bag !== null) {

        } else {

        }

        if (page.equipmentList!.length > 0) {

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold;font-size:120%;text-align:center' colspan='20'>＜ 随 身 装 备 ＞</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>选择</th>"
            html += "<th style='background-color:#EFE0C0'>装备</th>"
            html += "<th style='background-color:#E0D0B0'>名字</th>"
            html += "<th style='background-color:#EFE0C0'>种类</th>"
            html += "<th style='background-color:#E0D0B0'>效果</th>"
            html += "<th style='background-color:#EFE0C0'>重量</th>"
            html += "<th style='background-color:#EFE0C0'>耐久</th>"
            html += "<th style='background-color:#E0D0B0'>职需</th>"
            html += "<th style='background-color:#E0D0B0'>攻需</th>"
            html += "<th style='background-color:#E0D0B0'>防需</th>"
            html += "<th style='background-color:#E0D0B0'>智需</th>"
            html += "<th style='background-color:#E0D0B0'>精需</th>"
            html += "<th style='background-color:#E0D0B0'>速需</th>"
            html += "<th style='background-color:#EFE0C0'>威＋</th>"
            html += "<th style='background-color:#EFE0C0'>重＋</th>"
            html += "<th style='background-color:#EFE0C0'>幸＋</th>"
            html += "<th style='background-color:#E0D0B0'>经验</th>"
            html += "<th style='background-color:#EFE0C0'>属性</th>"
            html += "<th style='background-color:#E8E8D0'>使用</th>"
            html += "<th style='background-color:#E8E8D0'>收藏</th>"
            html += "</tr>";

            for (const equipment of page.equipmentList!) {
                if (equipment.isGoldenCage || equipment.isTreasureBag) {
                    continue;
                }
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>"
                html += "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredCareerHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredAttackHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredDefenseHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialAttackHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialDefenseHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpeedHtml + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>"
                html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>"
                html += "<td style='background-color:#EFE0C0'>" + equipment.attributeHtml + "</td>"
                html += "<td style='background-color:#E8E8D0'>"
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>"
                html += "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#equipmentList").html(html).parent().show();
        }
    }

}

export = PersonalEquipmentManagementPageProcessor_Castle;