import Credential from "../../util/Credential";
import EquipmentLocalStorage from "../EquipmentLocalStorage";
import PetLocalStorage from "../PetLocalStorage";

class BattleReturnInterceptor {

    readonly #credential: Credential;
    readonly #battleCount: number;

    constructor(credential: Credential, battleCount: number) {
        this.#credential = credential;
        this.#battleCount = battleCount;
    }

    async doBeforeReturn(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const petLocalStorage = new PetLocalStorage(this.#credential);
                petLocalStorage
                    .triggerUpdatePetMap(this.#battleCount)
                    .then(() => {
                        petLocalStorage
                            .triggerUpdatePetStatus(this.#battleCount)
                            .then(() => {
                                new EquipmentLocalStorage(this.#credential)
                                    .triggerUpdateEquipmentStatus(this.#battleCount)
                                    .then(() => {
                                        resolve();
                                    });
                            });
                    });
            });
        })();
    }

}

export = BattleReturnInterceptor;