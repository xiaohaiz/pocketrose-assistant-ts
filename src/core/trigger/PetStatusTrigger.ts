import Credential from "../../util/Credential";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import GoldenCage from "../monster/GoldenCage";
import CastleInformation from "../dashboard/CastleInformation";
import CastleRanch from "../monster/CastleRanch";
import {RolePetStatusManager} from "../monster/RolePetStatusManager";

/**
 * ============================================================================
 * 宠 物 状 态 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，战数尾数7/29/47/67/89。
 * 2. 战斗入手（非图鉴）触发。
 * ----------------------------------------------------------------------------
 * 统计用，非实时需求。
 * ============================================================================
 */
class PetStatusTrigger {

    readonly #credential: Credential;
    readonly statusManager: RolePetStatusManager;

    constructor(credential: Credential) {
        this.#credential = credential;
        this.statusManager = new RolePetStatusManager(credential);
    }

    #equipmentPage?: PersonalEquipmentManagementPage;
    #petPage?: PersonalPetManagementPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): PetStatusTrigger {
        this.#equipmentPage = value;
        return this;
    }

    withPetPage(value: PersonalPetManagementPage | undefined): PetStatusTrigger {
        this.#petPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    /**
     * pagePage is required.
     * equipmentPage is required.
     */
    async triggerUpdate() {
        // 解析身上的宠物
        await this.#initializePetPage();
        await this.statusManager.updatePersonalPetStatus(this.#petPage);

        // 解析黄金笼子中的宠物
        await this.#initializeEquipmentPage();
        const goldenCage = this.#equipmentPage!.findGoldenCage();
        if (goldenCage) {
            const cagePage = await new GoldenCage(this.#credential).open(goldenCage.index!);
            await this.statusManager.updateGoldenCagePetStatus(cagePage);
        }

        // 解析城堡牧场中的宠物
        const roleName = this.#equipmentPage!.role!.name!;
        const castlePage = await new CastleInformation().open();
        const castle = castlePage.findByRoleName(roleName);
        if (castle) {
            const ranchPage = await new CastleRanch(this.#credential).enter();
            await this.statusManager.updateCastleRanchPetStatus(ranchPage);
        }

    }
}

export = PetStatusTrigger;