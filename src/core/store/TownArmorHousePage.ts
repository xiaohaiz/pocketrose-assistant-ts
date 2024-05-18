import {Equipment} from "../equipment/Equipment";
import Role from "../role/Role";
import Merchandise from "./Merchandise";

class TownArmorHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];
    spaceCount?: number;

    findEquipment(index: number) {
        return this.equipmentList?.find(it => it.index === index) ?? null;
    }

    findMerchandise(index: number) {
        return this.merchandiseList?.find(it => it.index === index) ?? null;
    }

    findFirstSellableDragonBall() {
        return this.equipmentList?.find(it => it.isDragonBall && it.isSellable) ?? null;
    }
}

export = TownArmorHousePage;