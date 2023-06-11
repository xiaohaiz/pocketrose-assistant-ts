import Equipment from "../common/Equipment";
import Merchandise from "../common/Merchandise";
import TownLoader from "../core/town/TownLoader";

class TownWeaponHousePage {

    readonly townId: string;

    personalEquipmentList?: Equipment[];    // 身上的装备
    weaponMerchandiseList?: Merchandise[];  // 武器屋的商品列表
    discount?: number;                      // 武器屋当前的折扣
    roleCash?: number;                      // 角色现金
    spaceCount?: number;                    // 角色身上的空间

    constructor(townId: string) {
        this.townId = townId;
    }

    get title() {
        return TownLoader.load(this.townId)?.nameTitle + " 武 器 商 店";
    }

    findEquipment(index: number) {
        for (const equipment of this.personalEquipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findMerchandise(index: number) {
        for (const merchandise of this.weaponMerchandiseList!) {
            if (merchandise.index === index) {
                return merchandise;
            }
        }
        return null;
    }
}

export = TownWeaponHousePage;
