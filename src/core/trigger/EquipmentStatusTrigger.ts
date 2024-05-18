import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import TreasureBag from "../equipment/TreasureBag";
import CastleInformation from "../dashboard/CastleInformation";
import CastleWarehouse from "../equipment/CastleWarehouse";
import {RoleEquipmentStatusManager} from "../equipment/RoleEquipmentStatusManager";
import {CastleInformationPage} from "../dashboard/CastleInformationPage";

/**
 * ============================================================================
 * 装 备 状 态 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，尾数19/37/59/79/97。
 * 2. 战斗入手（非图鉴）触发。
 * ----------------------------------------------------------------------------
 * 统计用，非实时需求。
 * ============================================================================
 */
class EquipmentStatusTrigger {

    private readonly credential: Credential;
    private readonly statusManager: RoleEquipmentStatusManager

    constructor(credential: Credential) {
        this.credential = credential;
        this.statusManager = new RoleEquipmentStatusManager(credential);
    }

    private equipmentPage?: PersonalEquipmentManagementPage;
    castlePage?: CastleInformationPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentStatusTrigger {
        this.equipmentPage = value;
        return this;
    }

    withCastlePage(value?: CastleInformationPage): EquipmentStatusTrigger {
        this.castlePage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.equipmentPage) {
            this.equipmentPage = await new PersonalEquipmentManagement(this.credential).open();
        }
    }

    private async initializeCastlePage() {
        if (!this.castlePage) {
            this.castlePage = await new CastleInformation().openWithCache();
        }
    }

    /**
     * equipmentPage is required.
     */
    async triggerUpdate() {
        // 解析身上的装备
        await this.#initializeEquipmentPage();
        await this.statusManager.updatePersonalEquipmentStatus(this.equipmentPage);

        // 解析百宝袋中的装备
        const bag = this.equipmentPage!.findTreasureBag();
        if (bag) {
            const bagPage = await new TreasureBag(this.credential).open(bag.index!);
            await this.statusManager.updateTreasureBagEquipmentStatus(bagPage);
        }

        // 解析城堡仓库中的装备
        const roleName = this.equipmentPage!.role!.name!;
        await this.initializeCastlePage();
        const castle = this.castlePage!.findByRoleName(roleName);
        if (castle) {
            const warehousePage = await new CastleWarehouse(this.credential).open();
            await this.statusManager.updateCastleWarehouseEquipmentStatus(warehousePage);
        }
    }

}

export {EquipmentStatusTrigger};