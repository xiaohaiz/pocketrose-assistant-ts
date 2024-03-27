import _ from "lodash";
import Credential from "../../util/Credential";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import TownItemHouse from "./TownItemHouse";

/**
 * ============================================================================
 * 自动卖掉身上的龙珠。
 * ============================================================================
 */
class DragonBallAutoSell {

    readonly #credential: Credential;
    readonly #townId: string;

    #timer?: NodeJS.Timer;
    success?: () => void;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    get running(): boolean {
        return this.#timer !== undefined;
    }

    start() {
        if (this.#timer) {
            return;
        }
        this.#timer = setInterval(() => {
            this.#autoSellDragonBall().then();
        }, 1500);
    }

    shutdown() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = undefined;
        }
    }

    async #autoSellDragonBall() {
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        if (!equipmentPage.equipmentList || equipmentPage.equipmentList.length === 0) return;
        const indexList = _.forEach(equipmentPage.equipmentList)
            .filter(it => it.using === undefined || !it.using)
            .filter(it => it.isDragonBall)
            .map(it => it.index!);
        if (indexList.length === 0) return;
        const itemHousePage = await new TownItemHouse(this.#credential, this.#townId).open();
        if (itemHousePage.discount === undefined) return;
        await new TownItemHouse(this.#credential, this.#townId).sell(indexList[0], itemHousePage.discount);
        (this.success) && (this.success());
    }
}

export = DragonBallAutoSell;