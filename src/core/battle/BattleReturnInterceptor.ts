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
import {BattleConfigManager} from "../../setup/ConfigManager";
import LocalSettingManager from "../../setup/LocalSettingManager";
import {PetUsingTrigger} from "../trigger/PetUsingTrigger";
import {CastleInformationPage} from "../dashboard/CastleInformationPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PersonalChampionTrigger} from "../trigger/PersonalChampionTrigger";
import EquipmentUsingTrigger from "../trigger/EquipmentUsingTrigger";
import {PurgeExpiredStorageTrigger} from "../trigger/PurgeExpiredStorageTrigger";

const logger = PocketLogger.getLogger("BATTLE");

class BattleReturnInterceptor {

    readonly #credential: Credential;
    readonly #battleCount: number;
    readonly #battlePage: BattlePage;

    constructor(credential: Credential, battleCount: number, battlePage: BattlePage) {
        this.#credential = credential;
        this.#battleCount = battleCount;
        this.#battlePage = battlePage;
    }

    // Local cached

    private castlePage?: CastleInformationPage;
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
        logger.debug("Before return from battle...");
        const start = Date.now();
        await this._beforeExitBattle();
        const end = Date.now();
        logger.debug("Battle return interceptor finished.", (end - start));
    }

    private async _beforeExitBattle() {
        const roleStatusManager = new RoleStatusManager(this.#credential);
        if (!this.#battlePage.zodiacBattle && this.#hasHarvestExcludesPetMap()) {
            // 非十二宫战斗有入手，其实不知道是什么，只能排除不是图鉴
            // 有可能是宠物，也有可能是上洞、中塔、初森。
            // 为了保证数据一致性，直接清除角色状态中的祭奠RP即可。
            await roleStatusManager.unsetConsecrateRP();
        }

        let doCompleteBattleFieldTrigger: boolean = false;
        if (this.#battlePage.petEarnExperience) {
            const petLevel = (await roleStatusManager.load())?.readPetLevel;
            if (petLevel !== undefined && petLevel === 100) {
                // 宠物战斗中获取了经验值，但是缓存中的宠物等级是100，数据不一致了，清除。
                await roleStatusManager.unsetPet();
                doCompleteBattleFieldTrigger = true;
                logger.warn("Role cached data crashed, trigger full reloading.");
            }
        }

        if (this.#battlePage.petUpgrade) {
            // 宠物升级，更新缓存的对应数据
            await roleStatusManager.increasePetLevel();
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
                const trigger = new PetStatusTrigger(this.#credential)
                    .withEquipmentPage(this.#equipmentPage)
                    .withPetPage(this.#petPage);
                trigger.castlePage = this.castlePage;
                await trigger.triggerUpdate();
                this.castlePage = trigger.castlePage;

            } else {
                await this.#initializePetPage();
                await new RolePetStatusManager(this.#credential).updatePersonalPetStatus(this.#petPage);
            }
        }
        if (statisticsTriggered || mod === 97 || this.#hasHarvestExcludesPetMap()) {
            await this.#initializeEquipmentPage();
            if (statisticsTriggered || mod === 97) {
                const trigger = new EquipmentStatusTrigger(this.#credential)
                    .withEquipmentPage(this.#equipmentPage);
                trigger.castlePage = this.castlePage;
                await trigger.triggerUpdate();
                this.castlePage = trigger.castlePage;
            } else {
                const statusManager = new RoleEquipmentStatusManager(this.#credential);
                await statusManager.updatePersonalEquipmentStatus(this.#equipmentPage);
            }
        }
        if (mod === 19 || mod === 37 || mod === 59 || mod === 79 || mod === 97) {
            const trigger = new EquipmentGrowthTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage);
            await trigger.triggerUpdateEquipmentGrowth();
            if (!this.#equipmentPage && trigger.equipmentPage) {
                this.#equipmentPage = trigger.equipmentPage;
            }
        }
        if (new BattleConfigManager(this.#credential).isAutoSetBattleFieldEnabled) {
            if (doCompleteBattleFieldTrigger) {
                await new BattleFieldTrigger(this.#credential).triggerUpdate();
            } else {
                await new BattleFieldTrigger(this.#credential).triggerUpdateWhenBattle(this.#battlePage);
            }
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

        // 记录当前正在使用的装备数据
        await new EquipmentUsingTrigger(this.#credential).triggerUpdateFromBattlePage(this.#battlePage);

        // 触发自动领取俸禄
        await new PersonalSalaryTrigger(this.#credential).triggerReceive(this.#battleCount);

        // 触发自动个天比赛
        await new PersonalChampionTrigger(this.#credential).triggerPersonalChampionMatch();

        if (mod === 13) {
            // 队长执行清理过期数据的任务
            await new PurgeExpiredStorageTrigger(this.#credential).triggerPurgeExpiredStorage();
        }
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