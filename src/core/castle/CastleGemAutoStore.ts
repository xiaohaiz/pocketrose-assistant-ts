import _ from "lodash";
import Credential from "../../util/Credential";
import CastleWarehouse from "../equipment/CastleWarehouse";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";

class CastleGemAutoStore {

    readonly #credential: Credential;

    #timer?: NodeJS.Timer;

    success?: () => void;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    start() {
        if (this.#timer) {
            return;
        }
        this.#timer = setInterval(() => {
            this.#autoStore().then();
        }, 3000);
    }

    shutdown() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = undefined;
        }
    }

    async #autoStore() {
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        const candidateIndexList = _.forEach(equipmentPage.equipmentList!)
            .filter(it => {
                const name = it.name;
                return name === "威力宝石" || name === "幸运宝石" || name === "重量宝石";
            })
            .map(it => it.index!);
        if (candidateIndexList.length === 0) return;

        await new CastleWarehouse(this.#credential).putInto(candidateIndexList);
        if (this.success) {
            this.success();
        }
    }
}

export = CastleGemAutoStore;