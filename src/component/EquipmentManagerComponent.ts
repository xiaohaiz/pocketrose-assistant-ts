import Credential from "../util/Credential";
import Role from "../core/role/Role";
import PersonalEquipmentManagementPage from "../core/equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../core/equipment/PersonalEquipmentManagement";
import CredentialLocationModeSupport from "../core/location/CredentialLocationModeSupport";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import PocketPageRenderer from "../util/PocketPageRenderer";
import RoleUsingEquipmentStorage from "../core/role/RoleUsingEquipmentStorage";
import PageUtils from "../util/PageUtils";
import StringUtils from "../util/StringUtils";
import _ from "lodash";
import TreasureBag from "../core/equipment/TreasureBag";
import EquipmentSet from "../core/equipment/EquipmentSet";
import EquipmentSetLoader from "../core/equipment/EquipmentSetLoader";
import Equipment from "../core/equipment/Equipment";
import TownForgeHouse from "../core/forge/TownForgeHouse";
import MessageBoard from "../util/MessageBoard";
import SetupLoader from "../core/config/SetupLoader";
import TownBank from "../core/bank/TownBank";
import CastleBank from "../core/bank/CastleBank";
import TownEquipmentExpressHouse from "../core/equipment/TownEquipmentExpressHouse";
import CastleEquipmentExpressHouse from "../core/equipment/CastleEquipmentExpressHouse";
import CastleWarehouse from "../core/equipment/CastleWarehouse";
import PeopleFinderComponent from "./PeopleFinderComponent";

class EquipmentManagerComponent extends CredentialLocationModeSupport {

    private readonly peopleFinder: PeopleFinderComponent;

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
        this.peopleFinder = new PeopleFinderComponent(credential, locationMode);
    }

    onRefresh?: () => void;
    equipmentPage?: PersonalEquipmentManagementPage;

    generateHTML(): string {
        let html = "";
        html += "<table style='border-width:0;margin:auto;width:100%;background-color:#888888'>";
        html += "<tbody>";
        // ---- ROW 1 ----
        html += "<tr>";
        html += "<td>";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody id='_pocket_equipmentTable'>";
        html += "<tr style='background-color:skyblue'>";
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
        html += "<th>使用</th>";
        if (this.isTownMode) html += "<th>修理</th>";
        html += "<th>入袋</th>";
        if (this.isCastleMode) html += "<th>入库</th>";
        html += "<th>发送</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        // ---- ROW 2 ----
        html += "<tr style='background-color:#E8E8D0'>";
        html += "<td>";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            "<button role='button' id='_pocket_useEquipment' class='C_pocket_equipmentSelectRequired' disabled>使用装备</button>" +
            "<button role='button' id='_pocket_bagEquipment' class='C_pocket_equipmentSelectRequired' disabled style='display:none'>放入百宝袋</button>" +
            "<button role='button' id='_pocket_warehouseEquipment' class='C_pocket_equipmentSelectRequired' disabled style='display:none'>放入城堡仓库</button>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<button role='button' id='_pocket_restoreEquipment' disabled style='display:none'>恢复装备</button>" +
            "<button role='button' id='_pocket_chocolateEquipment' style='color:brown'>巧克力</button>" +
            "<button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_A'>套装Ａ</button>" +
            "<button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_B'>套装Ｂ</button>" +
            "<button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_C'>套装Ｃ</button>" +
            "<button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_D'>套装Ｄ</button>" +
            "<button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_E'>套装Ｅ</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
        html += "</td>";
        html += "</tr>";
        // ---- ROW 3 ----
        html += "<tr style='background-color:#E8E8D0'>";
        html += "<td style='text-align:center'>";
        html += this.peopleFinder.generateHTML();
        html += PocketPageRenderer.GO();
        html += "<button role='button' id='_pocket_sendEquipment' class='C_pocket_equipmentSelectRequired'>发送</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    bindButtons() {
        this.peopleFinder.bindButtons();

        $("#_pocket_useEquipment").on("click", () => {
            const indexList = this._calculateEquipmentSelection();
            if (indexList.length === 0) return;
            new PersonalEquipmentManagement(this.credential, this.townId)
                .use(indexList)
                .then(() => {
                    (this.onRefresh) && (this.onRefresh());
                });
        });
        $("#_pocket_bagEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                MessageBoard.publishWarning("没有选择可以放入百宝袋的装备，忽略！");
                return;
            }
            this._putIntoBag(equipments).then(() => {
                (this.onRefresh) && (this.onRefresh());
            });
        });
        $("#_pocket_warehouseEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                MessageBoard.publishWarning("没有选择可以放入城堡仓库的装备，忽略！");
                return;
            }
            const indexList = _.forEach(equipments).map(it => it.index!);
            new CastleWarehouse(this.credential).putInto(indexList).then(() => {
                (this.onRefresh) && (this.onRefresh());
            });
        });
        $("#_pocket_restoreEquipment").on("click", () => {
            RoleUsingEquipmentStorage.load(this.credential.id).then(data => {
                if (data !== null && data.available) {
                    const set = new EquipmentSet();
                    set.initialize();
                    set.weaponName = data.usingWeapon;
                    set.armorName = data.usingArmor;
                    set.accessoryName = data.usingAccessory;
                    new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                        .load(set)
                        .then(() => {
                            (this.onRefresh) && (this.onRefresh());
                        });
                }
            });
        });
        $("#_pocket_chocolateEquipment").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = "2015.02.14情人节巧克力";
            set.armorName = "2015.01.29十周年纪念";
            set.accessoryName = "2015.02.14情人节玫瑰";
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    (this.onRefresh) && (this.onRefresh());
                });
        });
        $(".C_pocket_equipmentSetButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const code = StringUtils.substringAfterLast(btnId, "_");
            const config = SetupLoader.loadEquipmentSetConfig(this.credential.id, code);
            if (!config.available) return;
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = config.weaponName;
            set.armorName = config.armorName;
            set.accessoryName = config.accessoryName;
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    (this.onRefresh) && (this.onRefresh());
                });
        });
        $("#_pocket_sendEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                MessageBoard.publishWarning("没有选择可以发送的装备，忽略！");
                return;
            }
            const target = this.peopleFinder.targetPeople;
            if (target === undefined || target === "") {
                MessageBoard.publishWarning("没有选择发送的对象，忽略！");
                return
            }
            this._sendEquipments(equipments, target).then(() => {
                (this.onRefresh) && (this.onRefresh());
            });
        });
    }

    async reload() {
        this.equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
    }

    async render(external?: Role) {
        await this._resetButtons(external);
        $(".C_pocket_equipmentButton").off("click");
        $(".C_pocket_equipment").remove();

        const equipmentTable = $("#_pocket_equipmentTable");
        for (const equipment of this.equipmentPage!.equipmentList!) {
            if (!equipment.selectable || equipment.isGoldenCage || equipment.isTreasureBag) {
                continue;
            }
            let html = "";
            html += "<tr class='C_pocket_equipment' id='_pocket_equipment_" + equipment.index + "'>";
            html += "<td style='background-color:#E8E8D0'>" +
                "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentSelectButton' " +
                "id='_pocket_equipment_select_" + equipment.index + "' style='color:grey'>选择</button>" +
                "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.usingHTML + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.nameHTML + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.category + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.power + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.weight + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.endureHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.additionalPowerHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.additionalWeightHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.additionalLuckHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.experienceHTML + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + equipment.attributeHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" +
                "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentUseButton' " +
                "id='_pocket_equipment_use_" + equipment.index + "'>" + equipment.buttonTitle + "</button>" +
                "</td>";
            if (this.isTownMode) {
                if (equipment.isRepairable) {
                    html += "<td style='background-color:#E8E8D0'>" +
                        "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentRepairButton' " +
                        "id='_pocket_equipment_repair_" + equipment.index + "'>修理</button>" +
                        "</td>";
                } else {
                    html += "<td style='background-color:#E8E8D0'></td>";
                }
            }
            if (equipment.using) {
                html += "<td style='background-color:#E8E8D0'></td>";
            } else {
                html += "<td style='background-color:#E8E8D0'>" +
                    "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentBagButton' " +
                    "id='_pocket_equipment_bag_" + equipment.index + "'>入袋</button>" +
                    "</td>";
            }
            if (this.isCastleMode) {
                if (equipment.using) {
                    html += "<td style='background-color:#E8E8D0'></td>";
                } else {
                    html += "<td style='background-color:#E8E8D0'>" +
                        "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentWarehouseButton' " +
                        "id='_pocket_equipment_warehouse_" + equipment.index + "'>入库</button>" +
                        "</td>";
                }
            }
            if (equipment.using) {
                html += "<td style='background-color:#E8E8D0'></td>";
            } else {
                html += "<td style='background-color:#E8E8D0'>" +
                    "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentSendButton' " +
                    "id='_pocket_equipment_send_" + equipment.index + "'>发送</button>" +
                    "</td>";
            }
            html += "</tr>";
            equipmentTable.append($(html));
        }

        let html = "";
        html += "<tr class='C_pocket_equipment'>";
        html += "<td style='background-color:skyblue' colspan='16'>";
        html += "<table style='background-color:transparent;width:100%;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:left;white-space:nowrap'>";
        html += "当前剩余空位：<span style='color:red;font-weight:bold'>" + this.equipmentPage!.spaceCount + "</span>";
        html += "</td>";
        html += "<td style='text-align:right;width:100%' id='_pocket_roleHitStatus'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        equipmentTable.append($(html));
        this._calculateRoleHitStatus(external);

        $(".C_pocket_equipmentSelectButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(
                btnId,
                () => {
                    $(".C_pocket_equipmentSelectRequired").prop("disabled", false);
                },
                () => {
                    if (this._calculateEquipmentSelection().length === 0) {
                        $(".C_pocket_equipmentSelectRequired").prop("disabled", true);
                    }
                }
            );
        });
        $(".C_pocket_equipmentUseButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelEquipmentSelection();
            PageUtils.triggerClick("_pocket_equipment_select_" + index);
            PageUtils.triggerClick("_pocket_useEquipment");
        });
        $(".C_pocket_equipmentRepairButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const equipment = this.equipmentPage!.findEquipment(index);
            if (equipment === null) return;
            this._repairIfNecessary([equipment]).then(() => {
                (this.onRefresh) && (this.onRefresh());
            });
        });
        $(".C_pocket_equipmentBagButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelEquipmentSelection();
            PageUtils.triggerClick("_pocket_equipment_select_" + index);
            PageUtils.triggerClick("_pocket_bagEquipment");
        });
        $(".C_pocket_equipmentWarehouseButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelEquipmentSelection();
            PageUtils.triggerClick("_pocket_equipment_select_" + index);
            PageUtils.triggerClick("_pocket_warehouseEquipment");
        });
        $(".C_pocket_equipmentSendButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelEquipmentSelection();
            PageUtils.triggerClick("_pocket_equipment_select_" + index);
            PageUtils.triggerClick("_pocket_sendEquipment");
        });
    }

    private async _resetButtons(external?: Role) {
        if (await this._hasTreasureBag(external)) {
            $("#_pocket_bagEquipment").show();
        } else {
            $("#_pocket_bagEquipment").hide();
        }
        if (this.isCastleMode) {
            $("#_pocket_warehouseEquipment").show();
        } else {
            $("#_pocket_warehouseEquipment").hide();
        }
        $(".C_pocket_equipmentSelectRequired").prop("disabled", true);

        const restoreConfig = await RoleUsingEquipmentStorage.load(this.credential.id);
        if (restoreConfig !== null && restoreConfig.available) {
            $("#_pocket_restoreEquipment").prop("disabled", false).show();
        } else {
            $("#_pocket_restoreEquipment").prop("disabled", true).hide();
        }
        $("#_pocket_equipment_set_A").prop("disabled", true).text("套装Ａ");
        $("#_pocket_equipment_set_B").prop("disabled", true).text("套装Ｂ");
        $("#_pocket_equipment_set_C").prop("disabled", true).text("套装Ｃ");
        $("#_pocket_equipment_set_D").prop("disabled", true).text("套装Ｄ");
        $("#_pocket_equipment_set_E").prop("disabled", true).text("套装Ｅ");

        const codes = ["A", "B", "C", "D", "E"];
        for (const code of codes) {
            const config = SetupLoader.loadEquipmentSetConfig(this.credential.id, code);
            if (!config.available) continue;
            const btn = $("#_pocket_equipment_set_" + code);
            if (config.alias !== undefined && config.alias !== "") {
                btn.text(config.alias);
            }
            btn.prop("disabled", !config.available);
        }
    }

    private async _hasTreasureBag(external?: Role): Promise<boolean> {
        if (this.equipmentPage!.findTreasureBag() !== null) {
            return true;
        }
        const role = await this.reInitializeRole(
            external,
            role => role.masterCareerList !== undefined || role.mirrorCount !== undefined
        );
        const ret = role.hasTreasureBag;
        return (ret === undefined) ? false : ret;
        return false;
    }

    private _calculateEquipmentSelection(): number[] {
        const indexList: number[] = [];
        $(".C_pocket_equipmentSelectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                indexList.push(index);
            }
        });
        return indexList;
    }

    private _cancelEquipmentSelection() {
        $(".C_pocket_equipmentSelectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                PageUtils.triggerClick(btnId);
            }
        });
    }

    private async _putIntoBag(equipments: Equipment[]) {
        await this._repairIfNecessary(equipments);
        const indexList = _.forEach(equipments).map(it => it.index!);
        await new TreasureBag(this.credential).putInto(indexList);
    }

    private async _sendEquipments(equipments: Equipment[], target: string) {
        await this._repairIfNecessary(equipments);
        const indexList = _.forEach(equipments).map(it => it.index!);
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(10);
            await new TownEquipmentExpressHouse(this.credential, this.townId).send(target, indexList);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(10);
            await new CastleEquipmentExpressHouse(this.credential).send(target, indexList);
            await new CastleBank(this.credential).deposit();
        }
    }

    private async _repairIfNecessary(equipments: Equipment[]) {
        if (!this.isTownMode) return;
        const candidates = _.forEach(equipments).filter(it => it.isRepairable);
        if (candidates.length === 0) return;
        for (const candidate of candidates) {
            await new TownForgeHouse(this.credential, this.townId).repair(candidate.index!);
            MessageBoard.publishMessage("完成修理：" + candidate.nameHTML);
        }
    }

    private _calculateRoleHitStatus(role?: Role) {
        if (role === undefined) return;
        let totalWeight = 0;
        _.forEach(this.equipmentPage!.equipmentList!)
            .filter(it => it.using)
            .forEach(it => {
                totalWeight += it.weight!;
                totalWeight += it.additionalWeight!;
            });
        const delta = role.speed! - totalWeight;
        let hitCount: number;
        if (delta < 50) {
            hitCount = 1;
        } else {
            hitCount = _.floor(delta / 50);
        }
        const status = "" +
            "（速度:" + role.speed + "） " +
            "（总重:" + totalWeight + "） " +
            "（ＨＩＴ:<span style='color:red;font-weight:bold'>" + hitCount + "击</span>）";
        $("#_pocket_roleHitStatus").html(status);
    }
}

export = EquipmentManagerComponent;