import Credential from "../../util/Credential";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import _ from "lodash";
import CastleBank from "../bank/CastleBank";
import CastlePetExpressHouse from "../monster/CastlePetExpressHouse";

class CastlePetAutoTransfer {

    readonly #credential: Credential;
    readonly #target: string;

    #timer?: NodeJS.Timer;
    success?: () => void;

    constructor(credential: Credential, target: string) {
        this.#credential = credential;
        this.#target = target;
    }

    get running(): boolean {
        return this.#timer !== undefined;
    }

    start() {
        if (this.#timer) {
            return;
        }
        this.#timer = setInterval(() => {
            this.#doTransfer().then();
        }, 3000);
    }

    shutdown() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = undefined;
        }
    }

    async #doTransfer() {
        const petPage = await new PersonalPetManagement(this.#credential).open();
        const indexList = _.forEach(petPage.petList!)
            .filter(it => it.using === undefined || !it.using)
            .map(it => it.index!);
        if (indexList.length === 0) return;

        await new CastleBank(this.#credential).withdraw(10);
        await new CastlePetExpressHouse(this.#credential).send(this.#target, indexList[0]);
        await new CastleBank(this.#credential).deposit();

        (this.success) && (this.success());
    }
}

export = CastlePetAutoTransfer;