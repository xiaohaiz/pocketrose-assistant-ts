import Credential from "../../util/Credential";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import _ from "lodash";
import CastleBank from "../bank/CastleBank";
import CastleEquipmentExpressHouse from "../equipment/CastleEquipmentExpressHouse";

class CastleGemAutoTransfer {

    readonly #credential: Credential;
    readonly #target: string;
    readonly #space: number;
    readonly #category: string;

    #timer?: NodeJS.Timer;
    success?: () => void;

    constructor(credential: Credential,
                target: string,
                space: number,
                category: string) {
        this.#credential = credential;
        this.#target = target;
        this.#space = space;
        this.#category = category;
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
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        const candidates = _.forEach(equipmentPage.equipmentList!)
            .filter(it => it.using === undefined || !it.using)
            .filter(it => it.isGem)
            .filter(it => {
                if (this.#category === "POWER") {
                    return it.name === "威力宝石";
                } else if (this.#category === "LUCK") {
                    return it.name === "幸运宝石";
                } else if (this.#category === "WEIGHT") {
                    return it.name === "重量宝石";
                } else {
                    return true;
                }
            });
        const len = _.min([candidates.length, this.#space])!;

        const indexList: number[] = [];
        for (let i = 0; i < len; i++) {
            indexList.push(candidates[i].index!);
        }
        if (indexList.length === 0) return;

        await new CastleBank(this.#credential).withdraw(10);
        await new CastleEquipmentExpressHouse(this.#credential).send(this.#target, indexList);
        await new CastleBank(this.#credential).deposit();

        (this.success) && (this.success());
    }
}

export = CastleGemAutoTransfer;