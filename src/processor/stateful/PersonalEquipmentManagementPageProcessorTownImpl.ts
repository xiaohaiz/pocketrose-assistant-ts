import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import PageUtils from "../../util/PageUtils";
import Equipment from "../../core/equipment/Equipment";
import _ from "lodash";
import TownForgeHouse from "../../core/forge/TownForgeHouse";
import MessageBoard from "../../util/MessageBoard";
import TownBank from "../../core/bank/TownBank";
import TownEquipmentExpressHouse from "../../core/equipment/TownEquipmentExpressHouse";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import CommentBoard from "../../util/CommentBoard";
import NpcLoader from "../../core/role/NpcLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import TownDashboard from "../../core/dashboard/TownDashboard";
import EquipmentConsecrateManager from "../../core/equipment/EquipmentConsecrateManager";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";

class PersonalEquipmentManagementPageProcessorTownImpl extends PersonalEquipmentManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    async doPostReformatPage(): Promise<void> {
        CommentBoard.createCommentBoard(NpcLoader.getNpcImageHtml("饭饭")!);
        CommentBoard.writeMessage("我就要一键祭奠，就要，就要！");
        CommentBoard.writeMessage("<input type='button' id='consecrateButton' value='祭奠选择的装备' style='display:none'>");

        new MouseClickEventBuilder(this.credential)
            .bind($("#p_3139"), () => {
                new TownDashboard(this.credential).open().then(dashboardPage => {
                    if (dashboardPage.role!.canConsecrate) {
                        $("#consecrateButton").show();
                    } else {
                        MessageBoard.publishWarning("祭奠还在冷却中！");
                        PageUtils.scrollIntoView("messageBoard");
                    }
                });
            });
        $("#consecrateButton")
            .on("click", () => {
                const candidate = _.forEach(this._calculateSelectedPersonalEquipment())
                    .map(it => this.equipmentPage.findEquipment(it))
                    .filter(it => it !== null)
                    .map(it => it!)
                    .filter(it => !it.using)
                    .filter(it => it.isWeapon || it.isArmor || it.isAccessory);
                if (candidate.length === 0) {
                    MessageBoard.publishWarning("没有选择可祭奠的装备，忽略！");
                    PageUtils.scrollIntoView("messageBoard");
                    return;
                }
                const consecrateCandidateNames = _.forEach(candidate)
                    .map(it => it.fullName)
                    .join("、");
                if (!confirm("请务必确认你将要祭奠的这些装备：" + consecrateCandidateNames)) {
                    return;
                }
                this.#consecrateEquipment(candidate).then(() => {
                    $("#consecrateButton").hide();
                    PageUtils.scrollIntoView("messageBoard");
                });
            });
    }

    async doCreatePersonalEquipmentList(): Promise<void> {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody id='personalEquipmentListTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%;text-align:center' " +
            "colspan='22'>＜ 随 身 装 备 ＞</td>";
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
        html += "<th style='background-color:#E8E8D0'>修理</th>"
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "<th style='background-color:#E8E8D0'>发送</th>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html);
    }


    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }

    async doBindItemShopButton(): Promise<void> {
        if (this.townId === undefined) {
            return;
        }
        $("#extension_2").html(PageUtils.generateItemShopForm(this.credential, this.townId!));
        $("#itemShopButton")
            .prop("disabled", false)
            .on("click", () => {
                PageUtils.disablePageInteractiveElements();
                this.doBeforeExit().then(() => {
                    PageUtils.triggerClick("openItemShop");
                });
            })
            .parent().show();
    }


    async doBindGemFuseButton(): Promise<void> {
        $("#extension_3").html(PageUtils.generateGemHouseForm(this.credential, this.townId));
        $("#gemFuseButton")
            .prop("disabled", false)
            .on("click", () => {
                PageUtils.disablePageInteractiveElements();
                this.doBeforeExit().then(() => {
                    PageUtils.triggerClick("openGemHouse");
                });
            })
            .parent().show();
    }

    async doBindSendButton() {
        $("#tr6_1").show()
        await super.doBindSendButton()
    }

    async doBindTransferGemButton(): Promise<void> {
        $("#tr6_2").show();
        PageUtils.enableElement("transferGemButton");
        PageUtils.enableElement("autoTransferGemButton");
        await super.doBindTransferGemButton();
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
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = ""
        html += "<tr class='C_personalEquipment'>"
        html += "<td id='personalEquipmentLog' style='background-color:skyblue;text-align:left' colspan='22'></td>"
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
        if (equipment.isRepairable) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentRepair_" + equipmentIndex + "'>修理</button>";
            tr.find("> td:eq(19)").html(html);
        }
        if (equipment.selectable && !equipment.using && this.treasureBagIndex >= -1) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentStore_" + equipmentIndex + "'>入袋</button>";
            tr.find("> td:eq(20)").html(html);
        }
        if (equipment.canSend) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentSend_" + equipmentIndex + "'>发送</button>";
            tr.find("> td:eq(21)").html(html);
        }

        await this.doBindSelectPersonalEquipment(equipmentIndex)
        await this.doBindUsePersonalEquipment(equipmentIndex)
        await this.doBindRepairPersonalEquipment(equipmentIndex)
        await this.doBindStorePersonalEquipment(equipmentIndex)
        await this.doBindSendPersonalEquipment(equipmentIndex)
    }

    async doBindRepairPersonalEquipment(index: number): Promise<void> {
        $("#_personalEquipmentRepair_" + index).on("click", () => {
            this._repairEquipment(index).then()
        });
    }


    async doBeforeExit(): Promise<void> {
        await super.doBeforeExit();
        const role = await this.loadRole();
        await new BattleFieldTrigger(this.credential).withRole(role).triggerUpdate();
    }

    async _repairEquipment(index: number) {
        await new TownForgeHouse(this.credential, this.townId).repair(index)
        const before = this.equipmentPage.findEquipment(index)
        if (before) MessageBoard.publishMessage("完全修复了" + before.fullName + "。")
        await this.reloadEquipmentPage()
        const after = this.equipmentPage.findEquipment(index);
        if (after) await this.doRenderPersonalEquipment(after)
    }

    async _putIntoBag(indexList: number[]): Promise<void> {
        await this.#repairIfNecessary(indexList)
        await super._putIntoBag(indexList)
    }

    async _sendItem(target: string, indexList: number[]): Promise<void> {
        await this.#repairIfNecessary(indexList)
        await new TownBank(this.credential, this.townId).withdraw(10)
        await new TownEquipmentExpressHouse(this.credential, this.townId).send(target, indexList)
        await new TownBank(this.credential, this.townId).deposit()
        await this.reloadEquipmentPage()
        await this.doRenderPersonalEquipmentList()
    }

    async #repairIfNecessary(indexList: number[]) {
        for (const index of indexList) {
            const equipment = this.equipmentPage.findEquipment(index)
            if (equipment === null) continue
            if (!equipment.isRepairable) continue
            await new TownForgeHouse(this.credential, this.townId).repair(index)
            MessageBoard.publishMessage("完全修复了" + equipment.fullName + "。")
        }
    }

    async #consecrateEquipment(candidate: Equipment[]) {
        const indexList = _.forEach(candidate).map(it => it.index!);
        const nameList = _.forEach(candidate).map(it => it.fullName);
        await new TownBank(this.credential, this.townId).withdraw(100);
        await new EquipmentConsecrateManager(this.credential).consecrate(indexList, nameList);
        await new TownBank(this.credential, this.townId).deposit();
        await this.reloadRole();
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
    }
}

export = PersonalEquipmentManagementPageProcessorTownImpl;