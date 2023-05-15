import PetMap from "../common/PetMap";
import Role from "../common/Role";

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
}

export = TownPetMapHousePage;