import PetMap from "../core/monster/PetMap";
import Role from "../core/role/Role";

class TownPetMapHousePage {

    role?: Role;
    petMapList?: PetMap[];

    asText() {
        let s = "";
        for (const pm of this.petMapList!) {
            s += pm.code!;
            s += "/";
            s += pm.count!;
            s += "  ";
        }
        return s;
    }

    asJson() {
        const list: {}[] = [];
        for (const pm of this.petMapList!) {
            const it = {};
            // @ts-ignore
            it.code = pm.code;
            // @ts-ignore
            it.count = pm.count;
            list.push(it);
        }
        return JSON.stringify(list);
    }
}

export = TownPetMapHousePage;