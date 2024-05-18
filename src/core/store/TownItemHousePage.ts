import {Equipment} from "../equipment/Equipment";
import Role from "../role/Role";
import TownLoader from "../town/TownLoader";
import Merchandise from "./Merchandise";

class TownItemHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];
    spaceCount?: number;

    get town() {
        return TownLoader.load(this.townId)!;
    }

    get hasTreasureBag(): boolean {
        for (const equipment of this.equipmentList!) {
            if (equipment.isTreasureBag) {
                return true;
            }
        }
        return false;
    }

    get treasureBag(): Equipment | null {
        for (const equipment of this.equipmentList!) {
            if (equipment.isTreasureBag) {
                return equipment;
            }
        }
        return null;
    }

    findEquipment(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findMerchandise(index: number) {
        for (const merchandise of this.merchandiseList!) {
            if (merchandise.index === index) {
                return merchandise;
            }
        }
        return null;
    }

    findFirstSellableDragonBall() {
        return this.equipmentList?.find(it => it.isDragonBall && it.isSellable) ?? null;
    }

    findFirstRecoverLotion() {
        return this.equipmentList?.find(it => it.isRecoverLotion && it.isSellable) ?? null;
    }
}

export = TownItemHousePage;