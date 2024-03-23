import Credential from "../../util/Credential";
import BankAccountTrigger from "../trigger/BankAccountTrigger";
import ZodiacBattlePetLoveTrigger from "../trigger/ZodiacBattlePetLoveTrigger";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import BattlePage from "./BattlePage";
import Role from "../role/Role";
import PersonalStatus from "../role/PersonalStatus";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PetMapStatusTrigger from "../trigger/PetMapStatusTrigger";
import _ from "lodash";
import PetStatusTrigger from "../trigger/PetStatusTrigger";
import EquipmentStatusTrigger from "../trigger/EquipmentStatusTrigger";
import EquipmentGrowthTrigger from "../trigger/EquipmentGrowthTrigger";
import SetupLoader from "../config/SetupLoader";
import EquipmentSpaceTrigger from "../trigger/EquipmentSpaceTrigger";
import PetSpaceTrigger from "../trigger/PetSpaceTrigger";

class BattleReturnInterceptor {

    readonly #credential: Credential;
    readonly #battleCount: number;
    readonly #battlePage: BattlePage;

    constructor(credential: Credential, battleCount: number, battlePage: BattlePage) {
        this.#credential = credential;
        this.#battleCount = battleCount;
        this.#battlePage = battlePage;
    }

    #role?: Role;
    #equipmentPage?: PersonalEquipmentManagementPage;
    #petPage?: PersonalPetManagementPage;

    async #initializeRole() {
        if (!this.#role) {
            this.#role = await new PersonalStatus(this.#credential).load();
        }
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

    async beforeExitBattle() {
        const mod = this.#battleCount & 100;
        if (mod === 73 || this.#battlePage.treasureBattle) {
            await new BankAccountTrigger(this.#credential).triggerUpdate();
        }
        if (mod === 83 || this.#hasHarvestIncludesPetMap()) {
            await new PetMapStatusTrigger(this.#credential).triggerUpdate();
        }
        if (mod === 7 || mod === 29 || mod === 47 || mod === 67 || mod === 89 || this.#hasHarvest()) {
            await Promise.all([
                this.#initializeEquipmentPage(),
                this.#initializePetPage()
            ]);
            await new PetStatusTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .withPetPage(this.#petPage)
                .updatePetStatus();
        }
        if (mod === 19 || mod === 37 || mod === 59 || mod === 79 || mod === 97 || this.#hasHarvestExcludesPetMap()) {
            await this.#initializeEquipmentPage();
            await new EquipmentStatusTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .updateEquipmentStatus();
        }
        if (mod === 19 || mod === 37 || mod === 59 || mod === 79 || mod === 97) {
            await this.#initializeEquipmentPage();
            await new EquipmentGrowthTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .triggerUpdate();
        }
        if (SetupLoader.isAutoSetBattleFieldEnabled()) {
            await Promise.all([
                this.#initializeRole(),
                this.#initializePetPage()
            ]);
            await new BattleFieldTrigger(this.#credential)
                .withRole(this.#role)
                .withPetPage(this.#petPage)
                .triggerUpdateWhenBattle(this.#battlePage);

        }
        if (this.#battlePage.zodiacBattle) {
            await this.#initializePetPage();
            await new ZodiacBattlePetLoveTrigger(this.#credential)
                .withPetPage(this.#petPage)
                .triggerPetLoveFixed(this.#battlePage);
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
    }

    #hasHarvest() {
        const harvestList = this.#battlePage.harvestList;
        return harvestList && harvestList.length > 0;
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