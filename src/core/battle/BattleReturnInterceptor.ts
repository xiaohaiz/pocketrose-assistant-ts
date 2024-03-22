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