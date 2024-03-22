import Credential from "../../util/Credential";
import BankRecordManager from "../bank/BankRecordManager";
import EquipmentLocalStorage from "../equipment/EquipmentLocalStorage";
import PetLocalStorage from "../monster/PetLocalStorage";
import RolePetLoveManager from "../monster/RolePetLoveManager";
import BattleFieldManager from "./BattleFieldManager";
import BattlePage from "./BattlePage";
import Role from "../role/Role";
import PersonalStatus from "../role/PersonalStatus";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PetMapStatusManager from "../monster/PetMapStatusManager";
import _ from "lodash";
import PetStatusManager from "../monster/PetStatusManager";

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
        if (mod === 73) {
            await new BankRecordManager(this.#credential)
                .updateBankRecord();
        }
        if (mod === 83 || this.#hasHarvestIncludesPetMap()) {
            await new PetMapStatusManager(this.#credential)
                .updatePetMapStatus();
        }
        if (mod === 89 || this.#hasHarvest()) {
            await Promise.all([
                this.#initializeEquipmentPage(),
                this.#initializePetPage()
            ]);
            await new PetStatusManager(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .withPetPage(this.#petPage)
                .updatePetStatus();
        }
        if (mod === 19 || mod === 37 || mod === 59 || mod === 79 || mod === 97 || this.#hasHarvest()) {

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

    async doBeforeReturn(): Promise<void> {
        await Promise.all([
            new BankRecordManager(this.#credential).triggerUpdateBankRecord(this.#battleCount),
            new PetLocalStorage(this.#credential).triggerUpdatePetMap(this.#battleCount),
            new PetLocalStorage(this.#credential).triggerUpdatePetStatus(this.#battleCount),
            new EquipmentLocalStorage(this.#credential).triggerUpdateEquipmentStatus(this.#battleCount),
            new BattleFieldManager(this.#credential).triggerBattleFieldChanged(this.#battlePage),
            new RolePetLoveManager(this.#credential).triggerPetLoveFixed(this.#battlePage),
        ]);
        return await (() => {
            return new Promise<void>(resolve => {
                resolve();
            });
        })();
    }

}

export = BattleReturnInterceptor;