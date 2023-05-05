import Credential from "../../util/Credential";
import TownGemMeltHousePage from "./TownGemMeltHousePage";
import Equipment from "../Equipment";

class TownGemHousePage {

    readonly credential: Credential;
    roleCash?: number;
    equipmentList?: Equipment[];
    gemList?: Equipment[];
    townGemMeltHousePage?: TownGemMeltHousePage;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    findEquipment(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findGem(index: number) {
        for (const gem of this.gemList!) {
            if (gem.index === index) {
                return gem;
            }
        }
        return null;
    }
}

export = TownGemHousePage;