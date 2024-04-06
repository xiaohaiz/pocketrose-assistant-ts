import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import MessageBoard from "../../util/MessageBoard";
import Equipment from "../../core/equipment/Equipment";
import _ from "lodash";
import CastleBank from "../../core/bank/CastleBank";
import CastleEquipmentExpressHouse from "../../core/equipment/CastleEquipmentExpressHouse";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import ButtonUtils from "../../util/ButtonUtils";

class PersonalEquipmentManagementPageProcessorCastleImpl extends PersonalEquipmentManagementPageProcessor {

    #autoPutGemIntoWarehouseTimer?: any;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
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
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "<th style='background-color:#E8E8D0'>入库</th>"
        html += "<th style='background-color:#E8E8D0'>发送</th>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html);
    }

    async doCreateWarehouseEquipmentList() {
        if (!(await this.doCheckCastleExistence())) return;

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='warehouseEquipmentListTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%' colspan='19'>";
        html += "＜ 城 堡 仓 库 ＞";
        html += "</td>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0'>序号</th>";
        html += "<th style='background-color:#E8E8D0'>选择</th>";
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
        html += "<th style='background-color:#E0D0B0'>取出</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#warehouseList").html(html);
    }

    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnCastleForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnCastle");
            });
        });
    }

    protected async doBindPutIntoWarehouseButton(): Promise<void> {
        $("#putIntoWarehouseButton")
            .show()
            .on("click", () => {
                const indexList = _.forEach(this._calculateSelectedPersonalEquipment())
                    .map(it => this.equipmentPage.findEquipment(it))
                    .filter(it => it !== null)
                    .filter(it => it!.selectable)
                    .filter(it => !it!.using)
                    .map(it => it!.index!)
                if (indexList.length === 0) {
                    MessageBoard.publishWarning("没有选择要放入仓库的装备，忽略！");
                    PageUtils.scrollIntoView("messageBoard");
                    return
                }
                this.#_putIntoWarehouse(indexList).then()
            })
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
        if (equipment.selectable && !equipment.using && this.treasureBagIndex >= -1) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_personalEquipmentStore_" + equipmentIndex + "'>入袋</button>";
            tr.find("> td:eq(19)").html(html);
        }
        if (equipment.selectable && !equipment.using) {
            const html = "<button role='button' " +
                "class='C_personalEquipmentButton C_personalEquipmentButton_" + equipmentIndex + "' " +
                "id='_putPersonalEquipmentIntoWarehouse_" + equipmentIndex + "'>入库</button>";
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
        await this.doBindStorePersonalEquipment(equipmentIndex)
        await this.doBindSendPersonalEquipment(equipmentIndex)
        $("#_putPersonalEquipmentIntoWarehouse_" + equipmentIndex).on("click", () => {
            this._cancelPersonalEquipmentSelection();
            if (this._clickPersonalEquipmentSelectButton(equipmentIndex)) {
                PageUtils.triggerClick("putIntoWarehouseButton");
            }
        });
    }

    async doRenderWarehouseEquipmentList() {
        if (!this.warehouseOpened || !(await this.doCheckCastleExistence())) return;

        $(".C_warehouseEquipmentButton").off("click");
        $(".C_warehouseEquipment").remove();

        const table = $("#warehouseEquipmentListTable");
        const equipmentList = Equipment.sortEquipmentList(this.warehousePage!.storageEquipmentList!);

        let sequence = 1;
        for (const equipment of equipmentList) {
            let html = "";
            html += "<tr class='C_warehouseEquipment' id='_warehouseEquipment_" + equipment.index + "'>";
            html += "<th style='background-color:#E0D0B0'>" + (sequence++) + "</th>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#EFE0C0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "<td style='background-color:#E0D0B0'></td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = "";
        html += "<tr class='C_warehouseEquipment' style='background-color:#F8F0E0'>";
        html += "<td colspan='19'>"
        html += "<table style='background-color:transparent;margin:auto;width:100%'><tbody>";
        html += "<tr>";
        html += "<td style='text-align:left'>";
        html += "<button role='button' " +
            "class='C_warehouseEquipmentButton C_selectWarehouseEquipmentRequired' " +
            "id='takeOutWarehouseButton'>从仓库中取出</button>"
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<button role='button' class='C_warehouseEquipmentButton' id='innerCloseWarehouseButton'>关闭仓库</button>"
        html += "</td>";
        html += "</tr>";
        html += "</tbody></table>";
        html += "</td>"
        html += "</tr>";
        table.append($(html));

        for (const equipment of equipmentList) {
            await this.doRenderWarehouseEquipment(equipment);
        }

        $("#tr8").show();

        $("#takeOutWarehouseButton").on("click", () => {
            const indexList = this._calculateSelectedWarehouseEquipment();
            if (indexList.length === 0) {
                MessageBoard.publishWarning("没有选择从仓库中取出的装备，忽略！");
                PageUtils.scrollIntoView("messageBoard");
                return;
            }
            if (indexList.length > this.equipmentPage.spaceCount) {
                MessageBoard.publishWarning("身上没有足够的空间，忽略！");
                PageUtils.scrollIntoView("messageBoard");
                return;
            }
            this.#_takeOutWarehouse(indexList).then();
        });
        $("#innerCloseWarehouseButton").on("click", () => PageUtils.triggerClick("closeWarehouseButton"))

        if (this._calculateSelectedWarehouseEquipment().length === 0) {
            $(".C_selectWarehouseEquipmentRequired").prop("disabled", true);
        }
    }

    async doRenderWarehouseEquipment(equipment: Equipment) {
        const equipmentIndex = equipment.index!;
        $(".C_warehouseEquipmentButton_" + equipmentIndex).off("click");
        const tr = $("#_warehouseEquipment_" + equipmentIndex);

        let html = "<button role='button' style='color:grey' " +
            "class='C_warehouseEquipment C_warehouseEquipmentSelectButton C_warehouseEquipmentButton_" + equipmentIndex + "' " +
            "id='_warehouseEquipmentSelect_" + equipmentIndex + "'>选择</button>";
        tr.find("> td:first").html(html);
        tr.find("> td:eq(1)").html(equipment.nameHTML!);
        tr.find("> td:eq(2)").html(equipment.category!);
        tr.find("> td:eq(3)").html(_.toString(equipment.power));
        tr.find("> td:eq(4)").html(_.toString(equipment.weight));
        tr.find("> td:eq(5)").html(equipment.endureHtml);
        tr.find("> td:eq(6)").html(equipment.requiredCareerHtml);
        tr.find("> td:eq(7)").html(equipment.requiredAttackHtml);
        tr.find("> td:eq(8)").html(equipment.requiredDefenseHtml);
        tr.find("> td:eq(9)").html(equipment.requiredSpecialAttackHtml);
        tr.find("> td:eq(10)").html(equipment.requiredSpecialDefenseHtml);
        tr.find("> td:eq(11)").html(equipment.requiredSpeedHtml);
        tr.find("> td:eq(12)").html(equipment.additionalPowerHtml);
        tr.find("> td:eq(13)").html(equipment.additionalWeightHtml);
        tr.find("> td:eq(14)").html(equipment.additionalLuckHtml);
        tr.find("> td:eq(15)").html(equipment.experienceHTML);
        tr.find("> td:eq(16)").html(equipment.attributeHtml);
        html = "<button role='button' " +
            "class='C_warehouseEquipment C_warehouseEquipmentButton_" + equipmentIndex + "' " +
            "id='_warehouseEquipmentFetch_" + equipmentIndex + "'>取出</button>";
        tr.find("> td:eq(17)").html(html);

        await this.#_bindSelectWarehouseEquipmentButton(equipmentIndex);
        await this.#_bindFetchWarehouseEquipmentButton(equipmentIndex);
    }

    async _sendItem(target: string, indexList: number[]): Promise<void> {
        await new CastleBank(this.credential).withdraw(10)
        await new CastleEquipmentExpressHouse(this.credential).send(target, indexList)
        await new CastleBank(this.credential).deposit()
        await this.reloadEquipmentPage()
        await this.doRenderPersonalEquipmentList()
    }

    async #_putIntoWarehouse(indexList: number[]) {
        await new CastleWarehouse(this.credential).putInto(indexList);
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
        await this.reloadWarehousePage();
        await this.doRenderWarehouseEquipmentList();
    }

    async #_takeOutWarehouse(indexList: number[]) {
        await new CastleWarehouse(this.credential).takeOut(indexList);
        await this.reloadEquipmentPage();
        await this.doRenderPersonalEquipmentList();
        await this.reloadWarehousePage();
        await this.doRenderWarehouseEquipmentList();
    }

    async #_bindSelectWarehouseEquipmentButton(index: number) {
        const btnId = "_warehouseEquipmentSelect_" + index
        $("#" + btnId).on("click", () => {
            PageUtils.toggleColor(btnId, undefined, undefined);
            const selected = this._calculateSelectedWarehouseEquipment();
            if (selected.length > 0) {
                $(".C_selectWarehouseEquipmentRequired").prop("disabled", false);
            } else {
                $(".C_selectWarehouseEquipmentRequired").prop("disabled", true);
            }
        });
    }

    async #_bindFetchWarehouseEquipmentButton(index: number) {
        const btnId = "_warehouseEquipmentFetch_" + index;
        $("#" + btnId).on("click", () => {
            this._calculateSelectedWarehouseEquipment();
            if (this._clickWarehouseEquipmentSelectButton(index)) {
                PageUtils.triggerClick("takeOutWarehouseButton");
            }
        });
    }


    async doBindWarehouseGemButtons(): Promise<void> {
        $("#tr6_4").show();
        $("#putGemIntoWarehouseButton")
            .prop("disabled", false)
            .show()
            .on("click", () => {
                const category = $("#_warehouseGemCategory").val() as string;
                const count = _.parseInt($("#_warehouseGemCount").val() as string);
                const gems = this.equipmentPage.findGems(category);
                let candidates: Equipment[];
                if (count === 0) {
                    candidates = gems;
                } else {
                    const len = _.min([gems.length, count])!;
                    candidates = _.slice(gems, 0, len);
                }
                let selectionCount = 0;
                this._cancelPersonalEquipmentSelection();
                _.forEach(candidates)
                    .map(it => it.index!)
                    .forEach(it => {
                        if (this._clickPersonalEquipmentSelectButton(it)) {
                            selectionCount++;
                        }
                    });
                if (selectionCount > 0) {
                    PageUtils.triggerClick("putIntoWarehouseButton");
                }
            });
        const takeGemOutWarehouseButton = $("#takeGemOutWarehouseButton");
        takeGemOutWarehouseButton.prev().show();
        takeGemOutWarehouseButton
            .prop("disabled", false)
            .show()
            .on("click", () => {
                const category = $("#_warehouseGemCategory").val() as string;
                const count = _.parseInt($("#_warehouseGemCount").val() as string);
                this.#_openWarehouseIfNecessary().then(() => {
                    const gems = this.warehousePage!.findGems(category);
                    let candidates: Equipment[];
                    if (count === 0) {
                        const space = this.equipmentPage.spaceCount;
                        const len = _.min([gems.length, space])!;
                        candidates = _.slice(gems, 0, len);
                    } else {
                        const len = _.min([gems.length, count])!;
                        candidates = _.slice(gems, 0, len);
                    }
                    let selectionCount = 0;
                    this._cancelWarehouseEquipmentSelection();
                    _.forEach(candidates)
                        .map(it => it.index!)
                        .forEach(it => {
                            if (this._clickWarehouseEquipmentSelectButton(it)) {
                                selectionCount++;
                            }
                        });
                    if (selectionCount > 0) {
                        PageUtils.triggerClick("takeOutWarehouseButton");
                    }
                });
            });
        const autoPutGemIntoWarehouseButton = $("#autoPutGemIntoWarehouseButton");
        autoPutGemIntoWarehouseButton.prev().show();
        autoPutGemIntoWarehouseButton
            .prop("disabled", false)
            .show()
            .on("click", () => {
                if (PageUtils.isColorGrey("autoPutGemIntoWarehouseButton")) {
                    ButtonUtils.clickBlueButtons($(".C_daemonButton"), "autoPutGemIntoWarehouseButton");
                    PageUtils.changeColorBlue("autoPutGemIntoWarehouseButton");
                    if (this.#autoPutGemIntoWarehouseTimer === undefined) {
                        this.#autoPutGemIntoWarehouseTimer = setInterval(() => {
                            this.reloadEquipmentPage().then(() => {
                                this.doRenderPersonalEquipmentList().then(() => {
                                    PageUtils.triggerClick("putGemIntoWarehouseButton");
                                });
                            });
                        }, 2000);
                    }
                } else if (PageUtils.isColorBlue("autoPutGemIntoWarehouseButton")) {
                    if (this.#autoPutGemIntoWarehouseTimer !== undefined) {
                        clearInterval(this.#autoPutGemIntoWarehouseTimer);
                        this.#autoPutGemIntoWarehouseTimer = undefined;
                    }
                    PageUtils.changeColorGrey("autoPutGemIntoWarehouseButton");
                }
            });
    }

    async #_openWarehouseIfNecessary() {
        if (this.warehouseOpened) return;
        this.warehouseOpened = true;
        await this.reloadWarehousePage();
        await this.doRenderWarehouseEquipmentList();
        PageUtils.disableElement("openWarehouseButton");
        PageUtils.enableElement("closeWarehouseButton");
    }
}

export = PersonalEquipmentManagementPageProcessorCastleImpl;