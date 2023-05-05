import Credential from "../../util/Credential";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemHousePage {

    readonly credential: Credential;
    townGemMeltHousePage?: TownGemMeltHousePage;

    constructor(credential: Credential) {
        this.credential = credential;
    }
}

export = TownGemHousePage;