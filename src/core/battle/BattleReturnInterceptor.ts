import Credential from "../../util/Credential";
import BankAccountTrigger from "../trigger/BankAccountTrigger";
import ZodiacBattlePetLoveTrigger from "../trigger/ZodiacBattlePetLoveTrigger";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import BattlePage from "./BattlePage";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PetMapStatusTrigger from "../trigger/PetMapStatusTrigger";
import _ from "lodash";
import PetStatusTrigger from "../trigger/PetStatusTrigger";
import {EquipmentStatusTrigger} from "../trigger/EquipmentStatusTrigger";
import EquipmentGrowthTrigger from "../trigger/EquipmentGrowthTrigger";
import EquipmentSpaceTrigger from "../trigger/EquipmentSpaceTrigger";
import PetSpaceTrigger from "../trigger/PetSpaceTrigger";
import {PersonalSalaryTrigger} from "../trigger/PersonalSalaryTrigger";
import {RoleEquipmentStatusManager} from "../equipment/RoleEquipmentStatusManager";
import {RolePetStatusManager} from "../monster/RolePetStatusManager";
import {RoleStatusManager} from "../role/RoleStatus";
import {BattleConfigManager} from "../config/ConfigManager";
import LocalSettingManager from "../config/LocalSettingManager";
import {PetUsingTrigger} from "../trigger/PetUsingTrigger";

class BattleReturnInterceptor {

    readonly #credential: Credential;
    readonly #battleCount: number;
    readonly #battlePage: BattlePage;

    constructor(credential: Credential, battleCount: number, battlePage: BattlePage) {
        this.#credential = credential;
        this.#battleCount = battleCount;
        this.#battlePage = battlePage;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;
    #petPage?: PersonalPetManagementPage;

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

    async beforeExitBattle() {
        const roleStatusManager = new RoleStatusManager(this.#credential);
        if (!this.#battlePage.zodiacBattle && this.#hasHarvestExcludesPetMap()) {
            // 非十二宫战斗有入手，其实不知道是什么，只能排除不是图鉴
            // 有可能是宠物，也有可能是上洞、中塔、初森。
            // 为了保证数据一致性，直接清除角色状态中的祭奠RP即可。
            await roleStatusManager.unsetConsecrateRP();
        }

        const statisticsTriggered = LocalSettingManager.drainStatisticsTriggered(this.#credential.id);

        const mod = this.#battleCount % 100;

        if (mod === 67 || statisticsTriggered || this.#battlePage.petLearnSpell || this.#battlePage.petUpgrade) {
            await this.#initializePetPage();
            await new PetUsingTrigger(this.#credential).withPetPage(this.#petPage).triggerUpdate();
        }

        if (mod === 73 || this.#battlePage.treasureBattle) {
            await new BankAccountTrigger(this.#credential).triggerUpdate();
        }
        if (mod === 83 || this.#hasHarvestIncludesPetMap()) {
            await new PetMapStatusTrigger(this.#credential).triggerUpdate();
        }
        if (statisticsTriggered || mod === 89 || this.#hasHarvestExcludesPetMap()) {
            if (statisticsTriggered || mod === 89) {
                await Promise.all([
                    this.#initializeEquipmentPage(),
                    this.#initializePetPage()
                ]);
                await new PetStatusTrigger(this.#credential)
                    .withEquipmentPage(this.#equipmentPage)
                    .withPetPage(this.#petPage)
                    .triggerUpdate();
            } else {
                await this.#initializePetPage();
                await new RolePetStatusManager(this.#credential).updatePersonalPetStatus(this.#petPage);
            }
        }
        if (statisticsTriggered || mod === 97 || this.#hasHarvestExcludesPetMap()) {
            await this.#initializeEquipmentPage();
            if (statisticsTriggered || mod === 97) {
                await new EquipmentStatusTrigger(this.#credential)
                    .withEquipmentPage(this.#equipmentPage)
                    .triggerUpdate();
            } else {
                const statusManager = new RoleEquipmentStatusManager(this.#credential);
                await statusManager.updatePersonalEquipmentStatus(this.#equipmentPage);
            }
        }
        if (mod === 19 || mod === 37 || mod === 59 || mod === 79 || mod === 97) {
            const trigger = new EquipmentGrowthTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage);
            await trigger.triggerUpdate();
            if (!this.#equipmentPage && trigger.equipmentPage) {
                this.#equipmentPage = trigger.equipmentPage;
            }
        }
        if (new BattleConfigManager(this.#credential).isAutoSetBattleFieldEnabled) {
            await new BattleFieldTrigger(this.#credential)
                .triggerUpdateWhenBattle(this.#battlePage);
        }
        if (this.#battlePage.zodiacBattle) {
            const trigger = new ZodiacBattlePetLoveTrigger(this.#credential)
                .withPetPage(this.#petPage);
            await trigger.triggerUpdateWhenBattle(this.#battlePage);
            if (!this.#petPage && trigger.petPage) {
                this.#petPage = trigger.petPage;
            }
        }
        if (this.#hasHarvestExcludesPetMap()) {
            await this.#initializeEquipmentPage();
            await new EquipmentSpaceTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .triggerUpdate();
        }
        if (this.#hasHarvestExcludesPetMap() && !this.#battlePage.zodiacBattle) {
            await this.#initializePetPage();
            await new PetSpaceTrigger(this.#credential)
                .withPetPage(this.#petPage)
                .triggerUpdate();
        }

        // 触发自动领取俸禄
        await new PersonalSalaryTrigger(this.#credential).triggerReceive(this.#battleCount);
    }

    #hasHarvestIncludesPetMap() {
        const harvestList = this.#battlePage.harvestList;
        if (!harvestList || harvestList.length === 0) return false;
        for (const s of harvestList) {
            if (_.includes(s, "图鉴")) {
                return true;
            }
        }
        return false;
    }

    #hasHarvestExcludesPetMap() {
        const harvestList = this.#battlePage.harvestList;
        if (!harvestList || harvestList.length === 0) return false;
        for (const s of harvestList) {
            if (!_.includes(s, "图鉴")) {
                return true;
            }
        }
        return false;
    }

}

export = BattleReturnInterceptor;