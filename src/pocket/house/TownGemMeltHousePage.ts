import Credential from "../../util/Credential";
import Equipment from "../Equipment";

class TownGemMeltHousePage {

    readonly credential: Credential;
    equipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }

    canMelt(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment.selectable!;
            }
        }
        return false;
    }

}

export = TownGemMeltHousePage;