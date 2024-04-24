import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import NpcLoader from "../core/role/NpcLoader";
import OperationMessage from "../util/OperationMessage";
import PageUtils from "../util/PageUtils";
import PersonalEquipmentManagement from "../core/equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../core/equipment/PersonalEquipmentManagementPage";
import StringUtils from "../util/StringUtils";
import TownBank from "../core/bank/TownBank";
import TownGemHousePage from "../core/forge/TownGemHousePage";
import TownGemMeltHouse from "../core/forge/TownGemMeltHouse";
import _ from "lodash";
import {Equipment, EquipmentPosition} from "../core/equipment/Equipment";
import {TownGemHouse} from "../core/forge/TownGemHouse";

class GemManager extends CommonWidget {

    readonly feature = new GemManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    gemPage?: TownGemHousePage;
    private equipmentPage?: PersonalEquipmentManagementPage;
    private selectedPosition?: EquipmentPosition;               // 当前被选择的装备

    private autoTimer?: any;

    generateHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "宝 石" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;'>" +
            "<tbody>" +
            "<tr>" +
            "<td>" + this.generateEquipmentHTML() + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='_pocket_GMM_GemList' style='background-color:#F8F0E0;text-align:center'></td>" +
            "</tr>" +
            "<tr>" +
            "<td>" + this.generateAssistantHTML() + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private generateEquipmentHTML() {
        let html = "";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-width:0'>";
        html += "<thead style='background-color:wheat;text-align:center'>";
        html += "<tr>";
        html += "<th>选择</th>";
        html += "<th>装备</th>";
        html += "<th>名字</th>";
        html += "<th>种类</th>";
        html += "<th>效果</th>";
        html += "<th>重量</th>";
        html += "<th>耐久</th>";
        html += "<th>威＋</th>";
        html += "<th>重＋</th>";
        html += "<th>幸＋</th>";
        html += "<th>经验</th>";
        html += "<th>属性</th>";
        html += "<th>宝石</th>";
        html += "<th>销毁</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' " +
            "id='_pocket_GMM_EquipmentTable'>";
        html += "</tbody>";
        html += "</table>"
        return html;
    }

    private generateAssistantHTML() {
        let html = "";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-width:0'>";
        html += "<tbody style='background-color:wheat;text-align:center'>";
        html += "<tr>";
        html += "<td style='width:64px;vertical-align:center;white-space:nowrap'>" + NpcLoader.getNpcImageHtml("末末") + "</td>";
        html += "<td style='text-align:left;width:100%'>";
        html += "<span style='font-weight:bold;font-size:120%;color:navy'>关于砸石头这种事儿，我可以负责任的说，真的是有手就行。</span><br>";
        html += "<span><button role='button' style='color:grey' " +
            "class='C_pocket_GMM_Daemon' " +
            "id='_pocket_GMM_AutoPower'>自动砸威力宝石</button> </span>";
        html += "<span><button role='button' style='color:grey' " +
            "class='C_pocket_GMM_Daemon' " +
            "id='_pocket_GMM_AutoWeight'>自动砸重量宝石</button> </span>";
        html += "<span><button role='button' style='color:grey' " +
            "class='C_pocket_GMM_Daemon' " +
            "id='_pocket_GMM_AutoLuck'>自动砸幸运宝石</button> </span>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>"
        return html;
    }

    bindButtons() {
        $("#_pocket_GMM_AutoPower").on("click", () => {
            this.autoGem("_pocket_GMM_AutoPower", "POWER").then();
        });
        $("#_pocket_GMM_AutoWeight").on("click", () => {
            this.autoGem("_pocket_GMM_AutoWeight", "WEIGHT").then();
        });
        $("#_pocket_GMM_AutoLuck").on("click", () => {
            this.autoGem("_pocket_GMM_AutoLuck", "LUCK").then();
        });
    }

    async reload() {
        this.gemPage = await new TownGemHouse(this.credential, this.townId).open();
    }

    async render(equipmentPage: PersonalEquipmentManagementPage) {
        this.equipmentPage = equipmentPage;

        $(".C_pocket_GMM_Mutable").off("click").off("dblclick");
        $(".C_pocket_GMM_Removal").remove();

        for (const equipment of this.gemPage!.equipmentList!) {
            const canFuse = equipment.selectable! && (!equipment.using! || (equipment.using! && equipment.name === "宠物蛋"));
            const canMelt = !equipment.using! && this.gemPage!.townGemMeltHousePage!.canMelt(equipment.index!);
            if (!canFuse && !canMelt) {
                continue;
            }

            const detail = this.equipmentPage!.findEquipment(equipment.index!)!;

            let html = "";
            html += "<tr class='C_pocket_GMM_Removal'>";
            html += "<td>";
            if (canFuse) {
                html += "<button role='button' style='color:grey' " +
                    "class='C_pocket_GMM_Mutable C_pocket_GMM_SelectButton' " +
                    "id ='_pocket_GMM_Select_" + equipment.index + "'>选择</button>";
            } else {
                html += "<button role='button' disabled>禁止</button>";
            }
            html += "</td>";
            html += "<td>" + equipment.usingHTML + "</td>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td>" + detail.additionalPowerHtml + "</td>";
            html += "<td>" + detail.additionalWeightHtml + "</td>";
            html += "<td>" + detail.additionalLuckHtml + "</td>";
            html += "<td>" + detail.experienceHTML + "</td>";
            html += "<td>" + detail.attributeHtml + "</td>";
            html += "<td>" + equipment.gemCountHtml + "</td>";
            html += "<td>";
            if (canMelt) {
                html += "<button role='button' style='color:red;font-weight:bold' " +
                    "class='C_pocket_GMM_Mutable C_pocket_GMM_MeltButton' " +
                    "id ='_pocket_GMM_Melt_" + equipment.index + "'>销毁</button>";
            } else {
                html += "<button role='button' disabled>禁止</button>";
            }
            html += "</td>";
            html += "</tr>";

            $("#_pocket_GMM_EquipmentTable").append($(html));
        }

        // 如果有之前选择的记录，则恢复按钮状态。
        const selectedEquipment = this.findLocationEquipment();
        if (selectedEquipment !== null) {
            const btnId = "_pocket_GMM_Select_" + selectedEquipment.index;
            PageUtils.changeColorBlue(btnId);
        }

        $(".C_pocket_GMM_SelectButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(
                btnId,
                () => {
                    this.cancelEquipmentSelection(btnId);
                    const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                    const target = this.gemPage!.findEquipment(index)!;
                    this.selectedPosition = this.scanEquipmentLocation(target);
                },
                () => {
                    this.selectedPosition = undefined;
                }
            );
        });
        $(".C_pocket_GMM_MeltButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const equipment = this.gemPage!.findEquipment(index);
            if (equipment === null) {
                this.refresh(OperationMessage.failure()).then();
                return;
            }
            if (!confirm("确认销毁“" + equipment.nameHTML + "”的宝石？")) {
                return;
            }
            this.meltGem(equipment).then();
        });

        if (this.gemPage!.gemList!.length === 0) {
            $("#_pocket_GMM_GemList").html(() => {
                return "<span style='font-weight:bold;font-size:200%;color:red'>没有发现任何可用的宝石！</span>";
            });
        } else {
            this.renderGemList();
        }
    }

    async dispose() {
    }

    private renderGemList() {
        const totalLineCount = _.ceil(this.gemPage!.gemList!.length / 10);
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='text-align:center;background-color:#F8F0E0'>";
        for (let line = 0; line < totalLineCount; line++) {
            html += "<tr>";
            for (let i = 0; i < 10; i++) {
                const currentIndex = line * 10 + i;
                if (currentIndex <= this.gemPage!.gemList!.length - 1) {
                    const gem = this.gemPage!.gemList![currentIndex]!;
                    html += this.generateGemButton(gem);
                } else {
                    html += "<td style='width:64px;height:64px'></td>";
                }
            }
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        $("#_pocket_GMM_GemList").html(html);

        $(".C_pocket_GMM_GemButton").on("click", event => {
            const equipment = this.findLocationEquipment();
            if (equipment === null) {
                this.feature.publishWarning("没有选择镶嵌宝石的装备，忽略！");
                return;
            }
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const gem = this.gemPage!.findGem(index);
            if (gem === null) {
                this.refresh(OperationMessage.failure()).then();
                return;
            }

            if (!confirm("确认为“" + equipment.nameHTML + "”镶嵌“" + gem.name + "”？")) {
                return;
            }

            this.fuseGem(equipment, gem).then();
        });
    }

    private generateGemButton(gem: Equipment) {
        if (gem.name === "威力宝石") {
            return "<td style='width:64px;height:64px'>" +
                "<button role='button' style='color:blue;font-weight:bold;width:64px;height:64px' " +
                "id='_pocket_GMM_Gem_" + gem.index + "' " +
                "class='C_pocket_GMM_Mutable C_pocket_GMM_GemButton'>威力<br>宝石</button>" +
                "</td>";
        }
        if (gem.name === "重量宝石") {
            return "<td style='width:64px;height:64px'>" +
                "<button role='button' style='color:green;font-weight:bold;width:64px;height:64px' " +
                "id='_pocket_GMM_Gem_" + gem.index + "' " +
                "class='C_pocket_GMM_Mutable C_pocket_GMM_GemButton'>重量<br>宝石</button>" +
                "</td>";
        }
        if (gem.name === "幸运宝石") {
            return "<td style='width:64px;height:64px'>" +
                "<button role='button' style='color:red;font-weight:bold;width:64px;height:64px' " +
                "id='_pocket_GMM_Gem_" + gem.index + "' " +
                "class='C_pocket_GMM_Mutable C_pocket_GMM_GemButton'>幸运<br>宝石</button>" +
                "</td>";
        }
        if (gem.name === "七心宝石") {
            return "<td style='width:64px;height:64px'>" +
                "<button role='button' style='font-weight:bold;width:64px;height:64px' " +
                "id='_pocket_GMM_Gem_" + gem.index + "' " +
                "class='C_pocket_GMM_Mutable C_pocket_GMM_GemButton'>七心<br>宝石</button>" +
                "</td>";
        }
    }

    private cancelEquipmentSelection(exceptId?: string) {
        $(".C_pocket_GMM_SelectButton").each((_idx, it) => {
            const btn = $(it);
            const btnId = btn.attr("id") as string;
            if (btnId !== exceptId) {
                if (PageUtils.isColorBlue(btnId)) {
                    PageUtils.triggerClick(btnId);
                }
            }
        });
    }

    private scanEquipmentLocation(equipment: Equipment): EquipmentPosition {
        let sequence = 0;
        for (const it of this.gemPage!.equipmentList!) {
            if (it.fullName === equipment.fullName) {
                if (it.index === equipment.index) {
                    break;
                } else {
                    sequence++;
                }
            }
        }
        const position = new EquipmentPosition();
        position.fullName = equipment.fullName;
        position.sequence = sequence;
        return position;
    }

    private findLocationEquipment(): Equipment | null {
        if (this.selectedPosition === undefined) {
            return null;
        }
        let sequence = 0;
        let theIdx: number | undefined = undefined;
        for (const equipment of this.gemPage!.equipmentList!) {
            if (equipment.fullName === this.selectedPosition.fullName!) {
                if (sequence === this.selectedPosition.sequence!) {
                    theIdx = equipment.index;
                    break;
                } else {
                    sequence++;
                }
            }
        }
        if (theIdx === undefined) {
            return null;
        }
        return this.gemPage!.findEquipment(theIdx);
    }

    private async fuseGem(equipment: Equipment, gem: Equipment) {
        await new TownGemHouse(this.credential, this.townId).fuse(equipment.index!, gem.index!, equipment.name);
        await this.refresh(OperationMessage.success());
    }

    private async meltGem(equipment: Equipment) {
        await new TownBank(this.credential, this.townId).withdraw(500);
        await new TownGemMeltHouse(this.credential, this.townId).melt(equipment.index!);
        await new TownBank(this.credential, this.townId).deposit();
        await this.refresh(OperationMessage.success());
    }

    private async autoGem(btnId: string, category: string) {
        if (this.findLocationEquipment() === null) {
            this.feature.publishWarning("没有选择镶嵌宝石的装备，忽略！");
            return;
        }
        PageUtils.toggleColor(
            btnId,
            () => {
                // Cancel other daemon(s)
                $(".C_pocket_GMM_Daemon").each((_idx, it) => {
                    const btn = $(it);
                    const id = btn.attr("id") as string;
                    if (id !== btnId) {
                        if (PageUtils.isColorBlue(id)) {
                            PageUtils.triggerClick(id);
                        }
                    }
                });
                this.feature.publishMessage("启动自动砸宝石进程。");
                this.autoTimer = setInterval(() => {
                    this.autoFuseGem(btnId, category).then();
                }, 2000);
            },
            () => {
                if (this.autoTimer !== undefined) {
                    clearInterval(this.autoTimer);
                    this.autoTimer = undefined;
                    this.feature.publishMessage("自动砸宝石进程结束。");
                }
            }
        );
    }

    private autoFuseGemInProgress: boolean = false;

    private async autoFuseGem(btnId: string, category: string) {
        if (this.autoFuseGemInProgress) {
            this.feature.publishWarning("继续等待砸宝石刷新数据完成。");
            return;
        }
        this.autoFuseGemInProgress = true;
        const equipment = this.findLocationEquipment();
        if (equipment === null) {
            this.autoFuseGemInProgress = false;
            PageUtils.triggerClick(btnId);
            return;
        }
        const canFuse = equipment.selectable! && (!equipment.using! || (equipment.using! && equipment.name === "宠物蛋"));
        if (!canFuse) {
            this.autoFuseGemInProgress = false;
            this.feature.publishMessage("所选装备已经没有剩余孔位，结束。");
            PageUtils.triggerClick(btnId);
            return;
        }

        const gem = this.findFirstGem(category);
        if (gem === null) {
            this.autoFuseGemInProgress = false;
            this.feature.publishMessage("已经没有剩余的宝石，结束。");
            PageUtils.triggerClick(btnId);
            return;
        }

        if (category === "POWER") {
            const detail = this.equipmentPage!.findEquipment(equipment.index!)!;
            if (detail.additionalPower! < 0) {
                this.autoFuseGemInProgress = false;
                this.feature.publishMessage("当前装备镶嵌威力宝石时出现负数，中断转手工处理。");
                PageUtils.triggerClick(btnId);
                return;
            }
            if (detail.category === "饰品" && detail.additionalPower! >= 50) {
                this.autoFuseGemInProgress = false;
                this.feature.publishMessage("当前饰品威力已经达到最大值50，结束。");
                PageUtils.triggerClick(btnId);
                return;
            }
            if (detail.category === "防具" && detail.additionalPower! >= 100) {
                this.autoFuseGemInProgress = false;
                this.feature.publishMessage("当前防具威力已经达到最大值100，结束。");
                PageUtils.triggerClick(btnId);
                return;
            }
            if (detail.category === "武器" && detail.additionalPower! >= 100) {
                this.autoFuseGemInProgress = false;
                this.feature.publishMessage("当前武器威力已经达到最大值100，结束。");
                PageUtils.triggerClick(btnId);
                return;
            }
        }

        await this.fuseGem(equipment, gem);
        this.autoFuseGemInProgress = false;
    }

    private findFirstGem(category: string): Equipment | null {
        let gem: Equipment | null = null;
        for (const it of this.gemPage!.gemList!) {
            if (category === "POWER" && it.name === "威力宝石") {
                gem = it;
                break;
            }
            if (category === "WEIGHT" && it.name === "重量宝石") {
                gem = it;
                break;
            }
            if (category === "LUCK" && it.name === "幸运宝石") {
                gem = it;
                break;
            }
        }
        return gem;
    }

    private async refresh(message: OperationMessage) {
        const equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        message.extensions.set("equipmentPage", equipmentPage);
        await this.reload();
        await this.render(equipmentPage);
        this.feature.publishRefresh(message);
    }
}

class GemManagerFeature extends CommonWidgetFeature {
}

export {GemManager, GemManagerFeature};