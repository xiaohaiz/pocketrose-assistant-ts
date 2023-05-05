import Credential from "../../util/Credential";
import Equipment from "../Equipment";
import Merchandise from "../../common/Merchandise";

/**
 * 城市武器屋页面数据结构的描述
 */
class TownWeaponStorePage {

    readonly credential: Credential;
    readonly townId: string;

    personalEquipmentList?: Equipment[];    // 身上的装备
    weaponMerchandiseList?: Merchandise[];  // 武器屋的商品列表
    discount?: number;                      // 武器屋当前的折扣
    roleCash?: number;                      // 角色现金
    spaceCount?: number;                    // 角色身上的空间

    constructor(credential: Credential, townId: string) {
        this.credential = credential;
        this.townId = townId;
    }
}

export = TownWeaponStorePage;
