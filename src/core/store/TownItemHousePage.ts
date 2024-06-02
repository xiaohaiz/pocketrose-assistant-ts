import Merchandise from "./Merchandise";
import Role from "../role/Role";
import {Equipment} from "../equipment/Equipment";

class TownItemHousePage {

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

    findLastSellableDragonBall() {
        return this.equipmentList?.reverse().find(it => it.isDragonBall && it.isSellable) ?? null;
    }

    findLastSellableRecoverLotion() {
        return this.equipmentList?.reverse().find(it => it.isRecoverLotion && it.isSellable) ?? null;
    }

    findLastSellableTrashEquipment() {
        return this.equipmentList?.reverse().find(it => it.isTrashEquipment && it.isSellable) ?? null;
    }
}

export = TownItemHousePage;