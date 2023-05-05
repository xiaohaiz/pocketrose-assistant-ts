import Credential from "../../util/Credential";
import TownGemMeltHousePage from "./TownGemMeltHousePage";
import Equipment from "../Equipment";

class TownGemHousePage {

    readonly credential: Credential;
    equipmentList?: Equipment[];
    gemList?: Equipment[];
    townGemMeltHousePage?: TownGemMeltHousePage;

    constructor(credential: Credential) {
        this.credential = credential;
    }
}

export = TownGemHousePage;