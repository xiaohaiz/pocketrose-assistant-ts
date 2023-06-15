import Credential from "../../util/Credential";
import BankRecordManager from "../bank/BankRecordManager";
import EquipmentLocalStorage from "../equipment/EquipmentLocalStorage";
import PetLocalStorage from "../monster/PetLocalStorage";

class BattleReturnInterceptor {

    readonly #credential: Credential;
    readonly #battleCount: number;

    constructor(credential: Credential, battleCount: number) {
        this.#credential = credential;
        this.#battleCount = battleCount;
    }

    async doBeforeReturn(): Promise<void> {
        await Promise.all([
            new BankRecordManager(this.#credential).triggerUpdateBankRecord(this.#battleCount),
            new PetLocalStorage(this.#credential).triggerUpdatePetMap(this.#battleCount),
            new PetLocalStorage(this.#credential).triggerUpdatePetStatus(this.#battleCount),
            new EquipmentLocalStorage(this.#credential).triggerUpdateEquipmentStatus(this.#battleCount),
        ]);
        return await (() => {
            return new Promise<void>(resolve => {
                resolve();
            });
        })();
    }

}

export = BattleReturnInterceptor;