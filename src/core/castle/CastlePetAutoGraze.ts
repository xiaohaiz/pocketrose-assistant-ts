import _ from "lodash";
import Credential from "../../util/Credential";
import CastleRanch from "../monster/CastleRanch";
import PersonalPetManagement from "../monster/PersonalPetManagement";

class CastlePetAutoGraze {

    readonly #credential: Credential;

    #timer?: any;

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
        const petPage = await new PersonalPetManagement(this.#credential).open();
        const indexList = _.forEach(petPage.petList!)
            .filter(it => it.using === undefined || !it.using)
            .map(it => it.index!);
        if (indexList.length === 0) return;

        await new CastleRanch(this.#credential).graze(indexList[0]);
        if (this.success) {
            this.success();
        }
    }
}

export = CastlePetAutoGraze;