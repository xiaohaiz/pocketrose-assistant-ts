import CastleBank from "../core/bank/CastleBank";
import CastleEquipmentExpressHouse from "../core/equipment/CastleEquipmentExpressHouse";
import CastleWarehouse from "../core/equipment/CastleWarehouse";
import CastleWarehousePage from "../core/equipment/CastleWarehousePage";
import CommonWidget from "./support/CommonWidget";
import Credential from "../util/Credential";
import {Equipment} from "../core/equipment/Equipment";
import EquipmentGrowthTrigger from "../core/trigger/EquipmentGrowthTrigger";
import EquipmentSet from "../core/equipment/EquipmentSet";
import EquipmentSetLoader from "../core/equipment/EquipmentSetLoader";
import EquipmentSpaceTrigger from "../core/trigger/EquipmentSpaceTrigger";
import EquipmentUsingTrigger from "../core/trigger/EquipmentUsingTrigger";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeMap from "../core/location/LocationModeMap";
import LocationModeMetro from "../core/location/LocationModeMetro";
import LocationModeTown from "../core/location/LocationModeTown";
import OperationMessage from "../util/OperationMessage";
import PageUtils from "../util/PageUtils";
import PeopleFinder from "./PeopleFinder";
import PersonalEquipmentManagement from "../core/equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../core/equipment/PersonalEquipmentManagementPage";
import PocketPageRenderer from "../util/PocketPageRenderer";
import Role from "../core/role/Role";
import RoleUsingEquipmentStorage from "../core/role/RoleUsingEquipmentStorage";
import SetupLoader from "../core/config/SetupLoader";
import StringUtils from "../util/StringUtils";
import TownBank from "../core/bank/TownBank";
import TownEquipmentExpressHouse from "../core/equipment/TownEquipmentExpressHouse";
import TownForgeHouse from "../core/forge/TownForgeHouse";
import TreasureBag from "../core/equipment/TreasureBag";
import TreasureBagPage from "../core/equipment/TreasureBagPage";
import _ from "lodash";
import {CommonWidgetFeature} from "./support/CommonWidgetFeature";
import {RoleEquipmentStatusManager} from "../core/equipment/RoleEquipmentStatusManager";
import {PocketPage} from "../util/PocketPage";

class EquipmentManager extends CommonWidget {

    readonly feature = new EquipmentManagerFeature();

    private _peopleFinder?: PeopleFinder;

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        super(credential, locationMode);
        if (this.isTownMode || this.isCastleMode) {
            this._peopleFinder = new PeopleFinder(credential, locationMode as LocationModeCastle | LocationModeTown);
        }
    }

    private _bagPage?: TreasureBagPage;
    private _warehousePage?: CastleWarehousePage;
    private _bagOpened = false;
    private _warehouseOpened = false;

    equipmentPage?: PersonalEquipmentManagementPage;

    private lastBagPage?: TreasureBagPage;
    private lastWarehousePage?: CastleWarehousePage;

    private gemTransferAutoSendTimer?: any;
    private gemTransferAutoPutIntoBagTimer?: any;
    private gemTransferAutoPutIntoWarehouseTimer?: any;

    generateHTML(): string {
        const cellCount = (this.isTownMode || this.isCastleMode) ? 16 : 14;

        let html = "";
        html += "<table style='border-width:0;margin:auto;width:100%;background-color:#888888'>";
        html += "<tbody>";
        // ------------------------------------------------
        // Personal equipment panel
        // ------------------------------------------------
        html += "<tr>";
        html += "<td>";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody id='_pocket_equipmentTable'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th style='font-size:120%;text-align:center' colspan='" + cellCount + "'>";
        html += "＜ 随 身 装 备 ＞";
        html += "</th>";
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
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
        if (this.isTownMode || this.isCastleMode) html += "<th>发送</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------
        // General command panel
        // ------------------------------------------------
        html += "<tr style='background-color:#E8E8D0'>";
        html += "<td>";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            "<span><button role='button' id='_pocket_useEquipment' class='C_pocket_equipmentSelectRequired' disabled>使用装备</button> </span>" +
            "<span><button role='button' id='_pocket_bagEquipment' class='C_pocket_equipmentSelectRequired' disabled style='display:none'>放入百宝袋</button> </span>" +
            "<span><button role='button' id='_pocket_warehouseEquipment' class='C_pocket_equipmentSelectRequired' disabled style='display:none'>放入城堡仓库</button> </span>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<span style='display:none'> <button role='button' disabled id='_pocket_EQM_blindBag' class='C_pocket_EQM_spaceRequired'>从百宝袋盲取</button></span>" +
            "<span style='display:none'> <button role='button' disabled id='_pocket_EQM_openBag'>打开百宝袋</button></span>" +
            "<span style='display:none'> <button role='button' disabled id='_pocket_EQM_closeBag'>关闭百宝袋</button></span>" +
            "<span style='display:none'> <button role='button' disabled id='_pocket_EQM_openWarehouse'>打开城堡仓库</button></span>" +
            "<span style='display:none'> <button role='button' disabled id='_pocket_EQM_closeWarehouse'>关闭城堡仓库</button></span>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------
        // Send related functionalities
        // ------------------------------------------------
        if (this.isTownMode || this.isCastleMode) {
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<td style='text-align:center'>";
            html += this._peopleFinder!.generateHTML();
            html += PocketPageRenderer.GO();
            html += "<button role='button' id='_pocket_sendEquipment' class='C_pocket_equipmentSelectRequired'>发送</button>";
            html += "</td>";
            html += "</tr>";
        }
        // ------------------------------------------------
        // Equipment SET related functionalities
        // ------------------------------------------------
        html += "<tr style='background-color:#E8E8D0'>";
        html += "<td>";
        html += "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;white-space:nowrap'>" +
            "<button role='button' id='_pocket_restoreEquipment' disabled style='display:none'>恢复装备</button>" +
            "</td>" +
            "<td style='text-align:right;width:100%'>" +
            "<span> <button role='button' id='_pocket_EQM_luckCharm' style='color:blue'>千与千寻</button></span>" +
            "<span> <button role='button' id='_pocket_EQM_rememberMe' style='color:red'>勿忘我</button></span>" +
            "<span> <button role='button' id='_pocket_EQM_magicBall' style='color:green'>魔法使的闪光弹</button></span>" +
            "<span> <button role='button' id='_pocket_EQM_chocolate' style='color:brown'>巧克力</button></span>" +
            "<span> <button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_A'>套装Ａ</button></span>" +
            "<span> <button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_B'>套装Ｂ</button></span>" +
            "<span> <button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_C'>套装Ｃ</button></span>" +
            "<span> <button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_D'>套装Ｄ</button></span>" +
            "<span> <button role='button' disabled class='C_pocket_equipmentSetButton' id='_pocket_equipment_set_E'>套装Ｅ</button></span>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------
        // GEM transfer panel
        // ------------------------------------------------
        if (this.feature.enableGemTransfer) {
            html += "<tr id='_pocket_EQM_GemTransferPanel' style='border-spacing:0'>";
            html += "<td>";
            html += this._createGemTransferPanelHTML();
            html += "</td>";
            html += "</tr>";
        }
        // ------------------------------------------------
        // Treasure bag panel
        // ------------------------------------------------
        html += "<tr id='_pocket_EQM_TB_panel' style='background-color:#888888;border-width:0;border-spacing:0;display:none'>";
        html += "<td style='text-align:center'>";
        html += this._createTreasureBagEquipmentHTML();
        html += "</td>";
        html += "</tr>";
        // ------------------------------------------------
        // Castle warehouse panel
        // ------------------------------------------------
        html += "<tr id='_pocket_EQM_CW_panel' style='background-color:#888888;border-width:0;border-spacing:0;display:none'>";
        html += "<td style='text-align:center'>";
        html += this._createCastleWarehouseEquipmentHTML();
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private _createGemTransferPanelHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;border-width:0;width:100%'>" +
            "<tbody style='background-color:#E8E8D0;text-align:left'>" +
            "<tr id='_pocket_EQM_GemTransfer_SendPanel'>" +
            "<td>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            PocketPage.generateGemSelectionHTML("_pocket_EQM_GT_1_1") +
            PocketPageRenderer.AND() +
            PocketPage.generateGemCountHTML("_pocket_EQM_GT_1_2") +
            PocketPageRenderer.GO() +
            "<button role='button' class='C_StatelessElement' id='_pocket_EQM_GT_1_3'>发送宝石</button>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<button role='button' class='C_EQM_GT_DaemonButton' id='_pocket_EQM_GT_1_5' style='color:grey'>自动发送宝石</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr id='_pocket_EQM_GemTransfer_BagPanel'>" +
            "<td>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            PocketPage.generateGemSelectionHTML("_pocket_EQM_GT_2_1", true) +
            PocketPageRenderer.AND() +
            PocketPage.generateGemCountHTML("_pocket_EQM_GT_2_2") +
            PocketPageRenderer.GO() +
            "<button role='button' class='C_StatelessElement' id='_pocket_EQM_GT_2_3'>宝石放入袋子</button>" +
            "<span> </span>" +
            "<button role='button' class='C_StatelessElement' id='_pocket_EQM_GT_2_4'>从袋子中取宝石</button>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<button role='button' class='C_EQM_GT_DaemonButton' id='_pocket_EQM_GT_2_5' style='color:grey'>自动宝石入袋</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr id='_pocket_EQM_GemTransfer_WarehousePanel'>" +
            "<td>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            PocketPage.generateGemSelectionHTML("_pocket_EQM_GT_3_1", true) +
            PocketPageRenderer.AND() +
            PocketPage.generateGemCountHTML("_pocket_EQM_GT_3_2") +
            PocketPageRenderer.GO() +
            "<button role='button' class='C_StatelessElement' id='_pocket_EQM_GT_3_3'>宝石放入仓库</button>" +
            "<span> </span>" +
            "<button role='button' class='C_StatelessElement' id='_pocket_EQM_GT_3_4'>从仓库中取宝石</button>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<button role='button' class='C_EQM_GT_DaemonButton' id='_pocket_EQM_GT_3_5' style='color:grey'>自动宝石入库</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private _createTreasureBagEquipmentHTML(): string {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody id='_pocket_EQM_TB_table'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%' colspan='12'>";
        html += "＜ 百 宝 袋 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>序号</th>"
        html += "<th>选择</th>"
        html += "<th>名字</th>"
        html += "<th>种类</th>"
        html += "<th>效果</th>"
        html += "<th>重量</th>"
        html += "<th>耐久</th>"
        html += "<th>威＋</th>"
        html += "<th>重＋</th>"
        html += "<th>幸＋</th>"
        html += "<th>经验</th>"
        html += "<th>取出</th>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private _createCastleWarehouseEquipmentHTML(): string {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody id='_pocket_EQM_CW_table'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold;font-size:120%' colspan='19'>";
        html += "＜ 城 堡 仓 库 ＞";
        html += "</td>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>序号</th>";
        html += "<th>选择</th>";
        html += "<th>名字</th>";
        html += "<th>种类</th>";
        html += "<th>效果</th>";
        html += "<th>重量</th>";
        html += "<th>耐久</th>";
        html += "<th>职业</th>";
        html += "<th>攻需</th>";
        html += "<th>防需</th>";
        html += "<th>智需</th>";
        html += "<th>精需</th>";
        html += "<th>速需</th>";
        html += "<th>威＋</th>";
        html += "<th>重＋</th>";
        html += "<th>幸＋</th>";
        html += "<th>经验</th>";
        html += "<th>属性</th>";
        html += "<th>取出</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    bindButtons() {
        this._peopleFinder?.bindButtons();

        $("#_pocket_useEquipment").on("click", () => {
            const indexList = this._calculateEquipmentSelection();
            if (indexList.length === 0) return;
            new PersonalEquipmentManagement(this.credential, this.townId)
                .use(indexList)
                .then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message).then();
                });
        });
        $("#_pocket_bagEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                this.feature.publishWarning("没有选择可以放入百宝袋的装备，忽略！");
                return;
            }
            this._putIntoBag(equipments).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, true).then();
            });
        });
        $("#_pocket_warehouseEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                this.feature.publishWarning("没有选择可以放入城堡仓库的装备，忽略！");
                return;
            }
            const indexList = _.forEach(equipments).map(it => it.index!);
            new CastleWarehouse(this.credential).putInto(indexList).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, false, true).then();
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
                            const message = OperationMessage.success();
                            this._triggerRefresh(message, true).then();
                        });
                }
            });
        });
        $("#_pocket_EQM_luckCharm").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "千与千寻";
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message, true).then();
                });
        });
        $("#_pocket_EQM_rememberMe").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "勿忘我";
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message, true).then();
                });
        });
        $("#_pocket_EQM_magicBall").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.accessoryName = "魔法使的闪光弹";
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message, true).then();
                });
        });
        $("#_pocket_EQM_chocolate").on("click", () => {
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = "2015.02.14情人节巧克力";
            set.armorName = "2015.01.29十周年纪念";
            set.accessoryName = "2015.02.14情人节玫瑰";
            new EquipmentSetLoader(this.credential, this.equipmentPage!.equipmentList!)
                .load(set)
                .then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message, true).then();
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
                    const message = OperationMessage.success();
                    this._triggerRefresh(message, true).then();
                });
        });
        $("#_pocket_sendEquipment").on("click", () => {
            const equipments = _.forEach(this._calculateEquipmentSelection())
                .map(it => this.equipmentPage!.findEquipment(it))
                .filter(it => it !== null)
                .map(it => it!)
                .filter(it => !it.using);
            if (equipments.length === 0) {
                this.feature.publishWarning("没有选择可以发送的装备，忽略！");
                return;
            }
            const target = this._peopleFinder!.targetPeople;
            if (target === undefined || target === "") {
                this.feature.publishWarning("没有选择发送的对象，忽略！");
                return
            }
            this._sendEquipments(equipments, target).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });

        $("#_pocket_EQM_blindBag").on("click", () => {
            const space = this.equipmentPage!.spaceCount;
            if (space === 0) {
                this.feature.publishWarning("身上没有剩余空位，忽略！");
                return;
            }
            new TreasureBag(this.credential).tryTakeOut(space).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
        $("#_pocket_EQM_openBag").on("click", () => {
            this._openBag().then(() => {
                // Reload and render treasure bag only.
                this._reloadBag().then(() => {
                    this._renderBag().then();
                });
            });
        });
        $("#_pocket_EQM_closeBag").on("click", () => {
            this._closeBag().then();
        });
        $("#_pocket_EQM_openWarehouse").on("click", () => {
            this._openWarehouse().then(() => {
                // Reload and render castle warehouse only.
                this._reloadWarehouse().then(() => {
                    this._renderWarehouse().then();
                });
            });
        });
        $("#_pocket_EQM_closeWarehouse").on("click", () => {
            this._closeWarehouse().then();
        });

        $("#_pocket_EQM_GT_1_3").on("click", () => {
            PocketPage.disableStatelessElements();
            this._gemTransfer_send().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_EQM_GT_1_5").on("click", () => {
            PageUtils.toggleColor(
                "_pocket_EQM_GT_1_5",
                () => {
                    this._cancelGemTransferDaemon("_pocket_EQM_GT_1_5");
                    this.gemTransferAutoSendTimer = setInterval(() => {
                        this._gemTransfer_send_auto().then();
                    }, 2000);
                },
                () => {
                    if (this.gemTransferAutoSendTimer !== undefined) {
                        clearInterval(this.gemTransferAutoSendTimer);
                        this.gemTransferAutoSendTimer = undefined;
                    }
                }
            );
        });
        $("#_pocket_EQM_GT_2_3").on("click", () => {
            PocketPage.disableStatelessElements();
            this._gemTransfer_putIntoBag().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_EQM_GT_2_4").on("click", () => {
            PocketPage.disableStatelessElements();
            this._gemTransfer_takeOutBag().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_EQM_GT_2_5").on("click", () => {
            PageUtils.toggleColor(
                "_pocket_EQM_GT_2_5",
                () => {
                    this._cancelGemTransferDaemon("_pocket_EQM_GT_2_5");
                    this.gemTransferAutoPutIntoBagTimer = setInterval(() => {
                        this._gemTransfer_putIntoBag_auto().then();
                    }, 2000);
                },
                () => {
                    if (this.gemTransferAutoPutIntoBagTimer !== undefined) {
                        clearInterval(this.gemTransferAutoPutIntoBagTimer);
                        this.gemTransferAutoPutIntoBagTimer = undefined;
                    }
                }
            );
        });
        $("#_pocket_EQM_GT_3_3").on("click", () => {
            PocketPage.disableStatelessElements();
            this._gemTransfer_putIntoWarehouse().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_EQM_GT_3_4").on("click", () => {
            PocketPage.disableStatelessElements();
            this._gemTransfer_takeOutWarehouse().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_EQM_GT_3_5").on("click", () => {
            PageUtils.toggleColor(
                "_pocket_EQM_GT_3_5",
                () => {
                    this._cancelGemTransferDaemon("_pocket_EQM_GT_3_5");
                    this.gemTransferAutoPutIntoWarehouseTimer = setInterval(() => {
                        this._gemTransfer_putIntoWarehouse_auto().then();
                    }, 2000);
                },
                () => {
                    if (this.gemTransferAutoPutIntoWarehouseTimer !== undefined) {
                        clearInterval(this.gemTransferAutoPutIntoWarehouseTimer);
                        this.gemTransferAutoPutIntoWarehouseTimer = undefined;
                    }
                }
            );
        });
    }

    async reload() {
        this.equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
    }

    private filterPersonalEquipment(equipment: Equipment): boolean {
        if (equipment.isGoldenCage || equipment.isTreasureBag) {
            return false;
        }
        if (equipment.isRecoverItem) {
            if (!this.feature.enableRecoverItem) {
                return false;
            }
            if (this.isTownMode || this.isCastleMode) {
                return true;
            }
        }
        return equipment.selectable!;
    }

    async render() {
        await this._resetButtons();
        await this._resetGemTransferPanel();

        $(".C_pocket_equipmentButton").off("click");
        $(".C_pocket_equipment").remove();

        const cellCount = (this.isTownMode || this.isCastleMode) ? 16 : 14;
        const equipmentTable = $("#_pocket_equipmentTable");
        for (const equipment of this.equipmentPage!.equipmentList!) {
            if (!this.filterPersonalEquipment(equipment)) {
                continue;
            }
            let html = "";
            html += "<tr class='C_pocket_equipment' id='_pocket_equipment_" + equipment.index + "'>";
            html += "<td style='background-color:#E8E8D0'>";
            if (equipment.selectable) {
                html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentSelectButton' " +
                    "id='_pocket_equipment_select_" + equipment.index + "' style='color:grey'>选择</button>";
            }
            html += "</td>";
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
            html += "<td style='background-color:#E8E8D0'>";
            if (equipment.selectable) {
                html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentUseButton' " +
                    "id='_pocket_equipment_use_" + equipment.index + "'>" + equipment.buttonTitle + "</button>";
            }
            html += "</td>";
            if (this.isTownMode) {
                html += "<td style='background-color:#E8E8D0'>";
                if (equipment.isRepairable) {
                    html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentRepairButton' " +
                        "id='_pocket_equipment_repair_" + equipment.index + "'>修理</button>";
                }
                html += "</td>";
            }
            html += "<td style='background-color:#E8E8D0'>";
            if (!equipment.using && !equipment.isRecoverItem) {
                html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentBagButton' " +
                    "id='_pocket_equipment_bag_" + equipment.index + "'>入袋</button>";
            }
            html += "</td>";
            if (this.isCastleMode) {
                html += "<td style='background-color:#E8E8D0'>";
                if (!equipment.using && !equipment.isRecoverItem) {
                    html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentWarehouseButton' " +
                        "id='_pocket_equipment_warehouse_" + equipment.index + "'>入库</button>";
                }
                html += "</td>";
            }
            if (this.isTownMode || this.isCastleMode) {
                html += "<td style='background-color:#E8E8D0'>";
                if (!equipment.using || equipment.isRecoverItem) {
                    html += "<button role='button' class='C_pocket_equipmentButton C_pocket_equipmentSendButton' " +
                        "id='_pocket_equipment_send_" + equipment.index + "'>发送</button>";
                }
                html += "</td>";
            }
            html += "</tr>";
            equipmentTable.append($(html));
        }

        let html = "";
        html += "<tr class='C_pocket_equipment'>";
        html += "<td style='background-color:wheat' colspan='" + cellCount + "'>";
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
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
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
            const equipment = this.equipmentPage!.findEquipment(index);
            if (equipment === null) return;
            if (equipment.isRecoverItem) {
                // 是回复类道具，需要用不一样的方式发送、
                const target = this._peopleFinder!.targetPeople;
                if (target === undefined || target === "") {
                    this.feature.publishWarning("没有选择发送的对象，忽略！");
                    return;
                }
                this._sendEquipments([equipment], target).then(() => {
                    const message = OperationMessage.success();
                    this._triggerRefresh(message).then();
                });
            } else {
                this._cancelEquipmentSelection();
                PageUtils.triggerClick("_pocket_equipment_select_" + index);
                PageUtils.triggerClick("_pocket_sendEquipment");
            }
        });
    }

    renderHitStatus(role?: Role) {
        if (!role || role.speed === undefined) return;
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

    async dispose() {
        if (this.gemTransferAutoSendTimer !== undefined) {
            clearInterval(this.gemTransferAutoSendTimer);
            this.gemTransferAutoSendTimer = undefined;
        }
        if (this.gemTransferAutoPutIntoBagTimer !== undefined) {
            clearInterval(this.gemTransferAutoPutIntoBagTimer);
            this.gemTransferAutoPutIntoBagTimer = undefined;
        }
        if (this.gemTransferAutoPutIntoWarehouseTimer !== undefined) {
            clearInterval(this.gemTransferAutoPutIntoWarehouseTimer);
            this.gemTransferAutoPutIntoWarehouseTimer = undefined;
        }
        const promises = [];
        if (this.feature.enableGrowthTriggerOnDispose) {
            const trigger = new EquipmentGrowthTrigger(this.credential);
            promises.push(trigger.withEquipmentPage(this.equipmentPage).triggerUpdate());
        }
        if (this.feature.enableSpaceTriggerOnDispose) {
            const trigger = new EquipmentSpaceTrigger(this.credential);
            promises.push(trigger.withEquipmentPage(this.equipmentPage).triggerUpdate());
        }
        if (this.feature.enableStatusTriggerOnDispose) {
            const statusManager = new RoleEquipmentStatusManager(this.credential);
            promises.push(statusManager.updatePersonalEquipmentStatus(this.equipmentPage));
            promises.push(statusManager.updateTreasureBagEquipmentStatus(this.lastBagPage));
            promises.push(statusManager.updateCastleWarehouseEquipmentStatus(this.lastWarehousePage));
        }
        if (this.feature.enableUsingTriggerOnDispose) {
            const trigger = new EquipmentUsingTrigger(this.credential);
            promises.push(trigger.withEquipmentPage(this.equipmentPage).triggerUpdate());
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
    }

    private async _resetButtons() {

        if (this._hasTreasureBag) {
            if (this.equipmentPage!.findTreasureBag() === null) {
                this.turnOnSpanButton("_pocket_EQM_blindBag");
                this.turnOffSpanButton("_pocket_EQM_openBag");
                this.turnOffSpanButton("_pocket_EQM_closeBag");
            } else {
                this.turnOffSpanButton("_pocket_EQM_blindBag");
                this.turnOnSpanButton("_pocket_EQM_openBag");
                this.turnOnSpanButton("_pocket_EQM_closeBag");
            }
        } else {
            this.turnOffSpanButton("_pocket_EQM_blindBag");
            this.turnOffSpanButton("_pocket_EQM_openBag");
            this.turnOffSpanButton("_pocket_EQM_openBag");
        }

        if (this.isCastleMode) {
            this.turnOnSpanButton("_pocket_EQM_openWarehouse");
            this.turnOnSpanButton("_pocket_EQM_closeWarehouse");
        } else {
            this.turnOffSpanButton("_pocket_EQM_openWarehouse");
            this.turnOffSpanButton("_pocket_EQM_closeWarehouse");
        }

        if (this._bagOpened) {
            PageUtils.disableElement("_pocket_EQM_openBag");
        } else {
            PageUtils.disableElement("_pocket_EQM_closeBag");
        }
        if (this._warehouseOpened) {
            PageUtils.disableElement("_pocket_EQM_openWarehouse");
        } else {
            PageUtils.disableElement("_pocket_EQM_closeWarehouse");
        }

        if (this.equipmentPage!.spaceCount === 0) {
            $(".C_pocket_EQM_spaceRequired").prop("disabled", true);
        }

        if (this._hasTreasureBag) {
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

    private async _resetGemTransferPanel() {
        if (!this.feature.enableGemTransfer) return;
        if (this.isTownMode || this.isCastleMode) {
            $("#_pocket_EQM_GemTransfer_SendPanel").show();
        } else {
            $("#_pocket_EQM_GemTransfer_SendPanel").hide();
        }
        if (this._hasTreasureBag) {
            $("#_pocket_EQM_GemTransfer_BagPanel").show();
            if (this.equipmentPage!.findTreasureBag() !== null) {
                $("#_pocket_EQM_GT_2_4").prop("disabled", false).show();
            } else {
                $("#_pocket_EQM_GT_2_4").prop("disabled", true).hide();
            }
        } else {
            $("#_pocket_EQM_GemTransfer_BagPanel").hide();
        }
        if (this.isCastleMode) {
            $("#_pocket_EQM_GemTransfer_WarehousePanel").show();
        } else {
            $("#_pocket_EQM_GemTransfer_WarehousePanel").hide();
        }
    }

    private get _hasTreasureBag(): boolean {
        const bag = this.equipmentPage!.findTreasureBag();
        if (bag !== null) return true;
        // 目前已知只有仙人掌和六娃因为某些原因丢失了
        // 笼子和袋子，直接硬编码处理吧。
        // 好了，又新加一个人，可怜的小鹿。
        const poorIds: string[] = ["miss2", "7711", "cangtong"];
        return _.includes(poorIds, this.credential.id);
    }

    _calculateEquipmentSelection(): number[] {
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

    private async _triggerRefresh(message: OperationMessage,
                                  includeBag: boolean = false,
                                  includeWarehouse: boolean = false) {
        await this.reload();
        await this.render();
        if (includeBag) {
            this.lastBagPage = undefined;
            await this._reloadBag();
            await this._renderBag();
        }
        if (includeWarehouse) {
            this.lastWarehousePage = undefined;
            await this._reloadWarehouse();
            await this._renderWarehouse();
        }
        this.feature.publishRefresh(message);
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
            this.feature.publishMessage("完成修理：" + candidate.nameHTML);
        }
    }

    private async _reloadBag() {
        if (!this._bagOpened) return;
        const bag = this.equipmentPage!.findTreasureBag()!;
        this._bagPage = await new TreasureBag(this.credential).open(bag.index!);
        this.lastBagPage = this._bagPage;
    }

    private async _renderBag() {
        if (!this._bagOpened) return;
        $(".C_pocket_EQM_TB_button").off("click").off("dblclick");
        $(".C_pocket_EQM_TB_equipment").remove();

        const table = $("#_pocket_EQM_TB_table");
        let sequence = 0;
        for (const equipment of this._bagPage!.sortedEquipmentList) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EQM_TB_equipment'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td>";
            html += "<span><button role='button' style='color:grey' " +
                "class='C_pocket_EQM_TB_button C_pocket_EQM_TB_selectButton' " +
                "id='_pocket_EQM_TB_select_" + equipment.index + "'>选择</button></span>";
            html += "</td>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td>" + equipment.additionalPowerHtml + "</td>";
            html += "<td>" + equipment.additionalWeightHtml + "</td>";
            html += "<td>" + equipment.additionalLuckHtml + "</td>";
            html += "<td>" + equipment.experienceHTML + "</td>";
            html += "<td>";
            html += "<span><button role='button' " +
                "class='C_pocket_EQM_TB_button C_pocket_EQM_TB_takeOutButton' " +
                "id='_pocket_EQM_TB_takeOut_" + equipment.index + "'>取出</button></span>";
            html += "</td>";
            html += "</tr>";
            table.append($(html));
        }
        let html = "";
        html += "<tr style='background-color:#E8E8D0' class='C_pocket_EQM_TB_equipment'>";
        html += "<td colspan='12' style='text-align:left'>";
        html += "当前剩余空位：<span style='color:red;font-weight:bold'>" + this._bagPage!.spaceCount + "</span>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='background-color:wheat' class='C_pocket_EQM_TB_equipment'>";
        html += "<td colspan='12'>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            "<span><button role='button' class='C_pocket_EQM_TB_button C_pocket_EQM_TB_selectRequired' " +
            "id='_pocket_EQM_TB_takeOut' disabled>从百宝袋取出</button></span>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<span><button role='button' class='C_pocket_EQM_TB_button' id='_pocket_EQM_TB_close'>关闭百宝袋</button></span>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>";
        html += "</tr>";
        table.append($(html));

        const selectButtons = $(".C_pocket_EQM_TB_selectButton");
        const takeOutButtons = $(".C_pocket_EQM_TB_takeOutButton");

        selectButtons.on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(btnId, undefined, undefined);
            const selectionCount = this._calculateBagEquipmentSelection().length;
            $(".C_pocket_EQM_TB_selectRequired")
                .prop("disabled", selectionCount === 0);
        });
        takeOutButtons.on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelBagEquipmentSelection();
            PageUtils.triggerClick("_pocket_EQM_TB_select_" + index);
            PageUtils.triggerClick("_pocket_EQM_TB_takeOut");
        });
        $("#_pocket_EQM_TB_takeOut").on("click", () => {
            const indexList = this._calculateBagEquipmentSelection();
            if (indexList.length === 0) return;
            new TreasureBag(this.credential).takeOut(indexList).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, true).then();
            });
        });
        $("#_pocket_EQM_TB_close").on("click", () => {
            PageUtils.triggerClick("_pocket_EQM_closeBag");
        });
    }

    private _calculateBagEquipmentSelection(): number[] {
        const indexList: number[] = [];
        $(".C_pocket_EQM_TB_selectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                indexList.push(index);
            }
        });
        return indexList;
    }

    private _cancelBagEquipmentSelection() {
        $(".C_pocket_EQM_TB_selectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                PageUtils.triggerClick(btnId);
            }
        });
    }

    private async _reloadWarehouse() {
        if (!this._warehouseOpened) return;
        this._warehousePage = await new CastleWarehouse(this.credential).open();
        this.lastWarehousePage = this._warehousePage;
    }

    private async _renderWarehouse() {
        if (!this._warehouseOpened) return;
        $(".C_pocket_EQM_CW_button").off("click").off("dblclick");
        $(".C_pocket_EQM_CW_equipment").remove();

        const table = $("#_pocket_EQM_CW_table");
        let sequence = 0;
        for (const equipment of this._warehousePage!.sortStorageEquipmentList) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0' class='C_pocket_EQM_CW_equipment'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td>";
            html += "<span><button role='button' style='color:grey' " +
                "class='C_pocket_EQM_CW_button C_pocket_EQM_CW_selectButton' " +
                "id='_pocket_EQM_CW_select_" + equipment.index + "'>选择</button></span>";
            html += "</td>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td>" + equipment.requiredCareerHtml + "</td>";
            html += "<td>" + equipment.requiredAttackHtml + "</td>";
            html += "<td>" + equipment.requiredDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialAttackHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpeedHtml + "</td>";
            html += "<td>" + equipment.additionalPowerHtml + "</td>";
            html += "<td>" + equipment.additionalWeightHtml + "</td>";
            html += "<td>" + equipment.additionalLuckHtml + "</td>";
            html += "<td>" + equipment.experienceHTML + "</td>";
            html += "<td>" + equipment.attributeHtml + "</td>";
            html += "<td>";
            html += "<span><button role='button' " +
                "class='C_pocket_EQM_CW_button C_pocket_EQM_CW_takeOutButton' " +
                "id='_pocket_EQM_CW_takeOut_" + equipment.index + "'>取出</button></span>";
            html += "</td>";
            html += "</tr>";
            table.append($(html));
        }

        let html = "";
        html += "<tr style='background-color:wheat' class='C_pocket_EQM_CW_equipment'>";
        html += "<td colspan='19'>" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%'>" +
            "<span><button role='button' class='C_pocket_EQM_CW_button C_pocket_EQM_CW_selectRequired' " +
            "id='_pocket_EQM_CW_takeOut' disabled>从城堡仓库取出</button></span>" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<span><button role='button' class='C_pocket_EQM_CW_button' id='_pocket_EQM_CW_close'>关闭城堡仓库</button></span>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>";
        html += "</tr>";
        table.append($(html));

        const selectButtons = $(".C_pocket_EQM_CW_selectButton");
        const takeOutButtons = $(".C_pocket_EQM_CW_takeOutButton");

        selectButtons.on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(btnId, undefined, undefined);
            const selectionCount = this._calculateWarehouseEquipmentSelection().length;
            $(".C_pocket_EQM_CW_selectRequired")
                .prop("disabled", selectionCount === 0);
        });
        takeOutButtons.on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this._cancelWarehouseEquipmentSelection();
            PageUtils.triggerClick("_pocket_EQM_CW_select_" + index);
            PageUtils.triggerClick("_pocket_EQM_CW_takeOut");
        });
        $("#_pocket_EQM_CW_takeOut").on("click", () => {
            const indexList = this._calculateWarehouseEquipmentSelection();
            if (indexList.length === 0) return;
            new CastleWarehouse(this.credential).takeOut(indexList).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, false, true).then();
            });
        });
        $("#_pocket_EQM_CW_close").on("click", () => {
            PageUtils.triggerClick("_pocket_EQM_closeWarehouse");
        });
    }

    private _calculateWarehouseEquipmentSelection(): number[] {
        const indexList: number[] = [];
        $(".C_pocket_EQM_CW_selectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                indexList.push(index);
            }
        });
        return indexList;
    }

    private _cancelWarehouseEquipmentSelection() {
        $(".C_pocket_EQM_CW_selectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                PageUtils.triggerClick(btnId);
            }
        });
    }

    private async _openBag() {
        if (this._bagOpened) return;
        this._bagOpened = true;
        $("#_pocket_EQM_TB_panel").show();
        PageUtils.disableElement("_pocket_EQM_openBag");
        PageUtils.enableElement("_pocket_EQM_closeBag");
    }

    private async _closeBag() {
        if (!this._bagOpened) return;
        this._bagOpened = false;
        $("#_pocket_EQM_TB_panel").hide();
        PageUtils.enableElement("_pocket_EQM_openBag");
        PageUtils.disableElement("_pocket_EQM_closeBag");
        this._bagPage = undefined;
        $(".C_pocket_EQM_TB_button").off("click").off("dblclick");
        $(".C_pocket_EQM_TB_equipment").remove();
    }

    private async _openWarehouse() {
        if (this._warehouseOpened) return;
        this._warehouseOpened = true;
        $("#_pocket_EQM_CW_panel").show();
        PageUtils.disableElement("_pocket_EQM_openWarehouse");
        PageUtils.enableElement("_pocket_EQM_closeWarehouse");
    }

    private async _closeWarehouse() {
        if (!this._warehouseOpened) return;
        this._warehouseOpened = false;
        $("#_pocket_EQM_CW_panel").hide();
        PageUtils.enableElement("_pocket_EQM_openWarehouse");
        PageUtils.disableElement("_pocket_EQM_closeWarehouse");
        this._warehousePage = undefined;
        $(".C_pocket_EQM_CW_button").off("click").off("dblclick");
        $(".C_pocket_EQM_CW_equipment").remove();
    }

    private _cancelGemTransferDaemon(currentBtnId: string) {
        $(".C_EQM_GT_DaemonButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (btnId !== currentBtnId) {
                if (PageUtils.isColorBlue(btnId)) {
                    PageUtils.triggerClick(btnId);
                }
            }
        });
    }

    private async _gemTransfer_send(silence: boolean = false) {
        const target = this._peopleFinder!.targetPeople;
        if (target === undefined) {
            if (!silence) this.feature.publishWarning("没有选择发送对象，忽略！");
            return;
        }
        const category = $("#_pocket_EQM_GT_1_1").val() as string;
        const count = _.parseInt($("#_pocket_EQM_GT_1_2").val() as string);
        let candidates = _.forEach(this.equipmentPage!.equipmentList!)
            .filter(it => !it.using!)
            .filter(it => it.canSend)
            .filter(it => it.checkGem(category))
        if (candidates.length === 0) {
            if (!silence) this.feature.publishWarning("没有符合条件的宝石，忽略！");
            return;
        }
        if (count > 0) {
            const size = _.min([count, candidates.length])!;
            candidates = candidates.slice(0, size);
        }
        await this._sendEquipments(candidates, target);
        await this._triggerRefresh(OperationMessage.success());
    }

    private async _gemTransfer_send_auto() {
        await this.reload();
        await this.render();
        await this._gemTransfer_send(true);
    }

    private async _gemTransfer_putIntoBag(silence: boolean = false) {
        const category = $("#_pocket_EQM_GT_2_1").val() as string;
        const count = _.parseInt($("#_pocket_EQM_GT_2_2").val() as string);
        let candidates = _.forEach(this.equipmentPage!.equipmentList!)
            .filter(it => !it.using!)
            .filter(it => it.checkGem(category))
        if (candidates.length === 0) {
            if (!silence) this.feature.publishWarning("没有符合条件的宝石，忽略！");
            return;
        }
        if (count > 0) {
            const size = _.min([count, candidates.length])!;
            candidates = candidates.slice(0, size);
        }
        await this._putIntoBag(candidates);
        await this._triggerRefresh(OperationMessage.success(), true);
    }

    private async _gemTransfer_putIntoBag_auto() {
        await this.reload();
        await this.render();
        await this._gemTransfer_putIntoBag(true);
    }

    private async _gemTransfer_takeOutBag() {
        const category = $("#_pocket_EQM_GT_2_1").val() as string;
        let count = _.parseInt($("#_pocket_EQM_GT_2_2").val() as string);
        const bag = this.equipmentPage!.findTreasureBag()!;
        const page = await new TreasureBag(this.credential).open(bag.index!);
        let candidates = _.forEach(page.equipmentList!)
            .filter(it => it.checkGem(category))
        if (candidates.length === 0) {
            this.feature.publishWarning("没有符合条件的宝石，忽略！");
            return;
        }
        if (count === 0) {
            count = this.equipmentPage!.spaceCount!;
        }
        if (count === 0) {
            this.feature.publishWarning("身上没有富裕的空间了，忽略！");
            return;
        }
        const size = _.min([count, candidates.length])!;
        candidates = candidates.slice(0, size);
        const indexList = _.forEach(candidates).map(it => it.index!);
        await new TreasureBag(this.credential).takeOut(indexList);
        await this._triggerRefresh(OperationMessage.success(), true);
    }

    private async _gemTransfer_putIntoWarehouse(silence: boolean = false) {
        const category = $("#_pocket_EQM_GT_3_1").val() as string;
        const count = _.parseInt($("#_pocket_EQM_GT_3_2").val() as string);
        let candidates = _.forEach(this.equipmentPage!.equipmentList!)
            .filter(it => !it.using!)
            .filter(it => it.checkGem(category))
        if (candidates.length === 0) {
            if (!silence) this.feature.publishWarning("没有符合条件的宝石，忽略！");
            return;
        }
        if (count > 0) {
            const size = _.min([count, candidates.length])!;
            candidates = candidates.slice(0, size);
        }
        const indexList = _.forEach(candidates).map(it => it.index!);
        await new CastleWarehouse(this.credential).putInto(indexList);
        await this._triggerRefresh(OperationMessage.success(), false, true);
    }

    private async _gemTransfer_takeOutWarehouse() {
        const category = $("#_pocket_EQM_GT_3_1").val() as string;
        let count = _.parseInt($("#_pocket_EQM_GT_3_2").val() as string);
        const page = await new CastleWarehouse(this.credential).open();
        let candidates = _.forEach(page.storageEquipmentList!)
            .filter(it => it.checkGem(category))
        if (candidates.length === 0) {
            this.feature.publishWarning("没有符合条件的宝石，忽略！");
            return;
        }
        if (count === 0) {
            count = this.equipmentPage!.spaceCount!;
        }
        if (count === 0) {
            this.feature.publishWarning("身上没有富裕的空间了，忽略！");
            return;
        }
        const size = _.min([count, candidates.length])!;
        candidates = candidates.slice(0, size);
        const indexList = _.forEach(candidates).map(it => it.index!);
        await new CastleWarehouse(this.credential).takeOut(indexList);
        await this._triggerRefresh(OperationMessage.success(), false, true);
    }

    private async _gemTransfer_putIntoWarehouse_auto() {
        await this.reload();
        await this.render();
        await this._gemTransfer_putIntoWarehouse(true);
    }
}

class EquipmentManagerFeature extends CommonWidgetFeature {

    enableRecoverItem: boolean = false;
    enableGemTransfer: boolean = false;
    enableGrowthTriggerOnDispose: boolean = false;
    enableSpaceTriggerOnDispose: boolean = false;
    enableStatusTriggerOnDispose: boolean = false;
    enableUsingTriggerOnDispose: boolean = false;

}

export {EquipmentManager, EquipmentManagerFeature};