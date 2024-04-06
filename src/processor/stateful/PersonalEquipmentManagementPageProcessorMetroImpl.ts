import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import PageUtils from "../../util/PageUtils";
import MessageBoard from "../../util/MessageBoard";
import Equipment from "../../core/equipment/Equipment";
import _ from "lodash";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";

class PersonalEquipmentManagementPageProcessorMetroImpl extends PersonalEquipmentManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    async doCreatePersonalEquipmentList(): Promise<void> {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody id='personalEquipmentListTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%;text-align:center' " +
            "colspan='20'>＜ 随 身 装 备 ＞</td>";
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
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html);
    }

    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnMapForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnMap");
            });
        });
    }

    async doRenderPersonalEquipmentList(): Promise<void> {

        $(".C_personalEquipmentButton").off("click");
        $(".C_personalEquipment").remove();

        const table = $("#personalEquipmentListTable");

        for (const equipment of this.equipmentPage.equipmentList!) {
            if (equipment.isGoldenCage || equipment.isTreasureBag) {
                continue;
            }
            let html = "";
            html += "<tr class='C_personalEquipment' id='_personalEquipment_" + equipment.index + "'>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = ""
        html += "<tr class='C_personalEquipment'>"
        html += "<td id='personalEquipmentLog' style='background-color:skyblue;text-align:left' colspan='20'></td>"
        html += "</tr>"
        table.append($(html))

        for (const equipment of this.equipmentPage.equipmentList!) {
            if (equipment.isGoldenCage || equipment.isTreasureBag) {
                continue;
            }
            await this.doRenderPersonalEquipment(equipment);
        }

        MessageBoard.resetMessageBoard(
            "<span style='font-size:120%'>当前身上剩余空间：" +
            "<span style='color:red;font-weight:bold'>" + this.equipmentPage.spaceCount + "</span></span>",
            "personalEquipmentLog")

        if (this._calculateSelectedPersonalEquipment().length === 0) {
            $(".C_selectPersonalEquipmentRequired").prop("disabled", true);
        }
    }

    async doRenderPersonalEquipment(equipment: Equipment) {
        const equipmentIndex = equipment.index!;
        $(".C_personalEquipmentButton_" + equipmentIndex).off("click");

        const tr = $("#_personalEquipment_" + equipmentIndex);
        if (equipment.selectable) {
            const html = "<button role='button' style='color:grey' " +
                "class='C_personalEquipmentButton C_personalEquipmentSelectButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentSelect_" + equipmentIndex + "'>选择</button>";
            tr.find("> td:first").html(html);
        }
        tr.find("> td:eq(1)").html(equipment.usingHTML);
        tr.find("> td:eq(2)").html(equipment.nameHTML!);
        tr.find("> td:eq(3)").html(equipment.category!);
        tr.find("> td:eq(4)").html(_.toString(equipment.power));
        tr.find("> td:eq(5)").html(_.toString(equipment.weight));
        tr.find("> td:eq(6)").html(equipment.endureHtml);
        tr.find("> td:eq(7)").html(equipment.requiredCareerHtml);
        tr.find("> td:eq(8)").html(equipment.requiredAttackHtml);
        tr.find("> td:eq(9)").html(equipment.requiredDefenseHtml);
        tr.find("> td:eq(10)").html(equipment.requiredSpecialAttackHtml);
        tr.find("> td:eq(11)").html(equipment.requiredSpecialDefenseHtml);
        tr.find("> td:eq(12)").html(equipment.requiredSpeedHtml);
        tr.find("> td:eq(13)").html(equipment.additionalPowerHtml);
        tr.find("> td:eq(14)").html(equipment.additionalWeightHtml);
        tr.find("> td:eq(15)").html(equipment.additionalLuckHtml);
        tr.find("> td:eq(16)").html(equipment.experienceHTML);
        tr.find("> td:eq(17)").html(equipment.attributeHtml);
        if (equipment.selectable) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentUse_" + equipmentIndex + "'>" + equipment.buttonTitle + "</button>";
            tr.find("> td:eq(18)").html(html);
        }
        if (equipment.selectable && !equipment.using && this.treasureBagIndex >= -1) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentStore_" + equipmentIndex + "'>入袋</button>";
            tr.find("> td:eq(19)").html(html);
        }

        await this.doBindSelectPersonalEquipment(equipmentIndex)
        await this.doBindUsePersonalEquipment(equipmentIndex)
        await this.doBindStorePersonalEquipment(equipmentIndex)
    }
}

export = PersonalEquipmentManagementPageProcessorMetroImpl;