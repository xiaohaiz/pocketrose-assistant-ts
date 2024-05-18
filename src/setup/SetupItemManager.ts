import SetupItem from "./SetupItem";
import ComplexSetupItem002 from "./battle/ComplexSetupItem002";
import SetupItem003 from "../core/config/internal/SetupItem003";
import SetupItem004 from "../core/config/internal/SetupItem004";
import SetupItem005 from "../core/config/internal/SetupItem005";
import SetupItem036 from "../core/config/internal/SetupItem036";
import SetupItem054 from "../core/config/internal/SetupItem054";
import SetupItem056 from "../core/config/internal/SetupItem056";
import SetupItem064 from "../core/config/internal/SetupItem064";
import {ComplexSetupItem083} from "./ui/ComplexSetupItem083";
import {ComplexSetupItem084} from "./ui/ComplexSetupItem084";
import {SetupItem001} from "./ui/SetupItem001";
import {SetupItem026} from "./ui/SetupItem026";
import {SetupItem028} from "./ui/SetupItem028";
import {SetupItem035} from "./ui/SetupItem035";
import {SetupItem038} from "./ui/SetupItem038";
import {SetupItem041} from "../core/config/internal/SetupItem041";
import {SetupItem043} from "./ui/SetupItem043";
import {SetupItem044} from "./misc/SetupItem044";
import {SetupItem045} from "./battle/SetupItem045";
import {SetupItem048} from "./ui/SetupItem048";
import {SetupItem057} from "./ui/SetupItem057";
import {SetupItem058} from "./ui/SetupItem058";
import {SetupItem062} from "./ui/SetupItem062";
import {SetupItem069} from "./misc/SetupItem069";
import {SetupItem071} from "../core/config/internal/SetupItem071";
import {SetupItem072} from "./ui/SetupItem072";
import {SetupItem073} from "./misc/SetupItem073";
import {SetupItem074} from "./battle/SetupItem074";
import {SetupItem075} from "./ui/SetupItem075";
import {SetupItem076} from "./misc/SetupItem076";
import {SetupItem077} from "./ui/SetupItem077";
import {SetupItem078} from "./misc/SetupItem078";
import {SetupItem079} from "./ui/SetupItem079";
import {SetupItem080} from "./ui/SetupItem080";
import {SetupItem081} from "./ui/SetupItem081";
import {SetupItem082} from "./ui/SetupItem082";
import {SetupItem085} from "./misc/SetupItem085";
import {SetupItem086} from "./battle/SetupItem086";
import {SetupItem087} from "./battle/SetupItem087";
import {SetupItem088} from "./misc/SetupItem088";

class SetupItemManager {

    readonly #setupItemList: SetupItem[];

    constructor() {
        this.#setupItemList = [
            // UI
            new SetupItem075(),
            new SetupItem001(),
            new SetupItem026(),
            new SetupItem028(),
            new SetupItem035(),
            new SetupItem038(),
            new SetupItem043(),
            new SetupItem048(),
            new SetupItem057(),
            new SetupItem058(),
            new SetupItem062(),
            new SetupItem072(),
            new SetupItem077(),
            new SetupItem079(),
            new SetupItem082(),
            new SetupItem080(),
            new SetupItem081(),

            new SetupItem036(),
            new SetupItem041(),
            new SetupItem054(),
            new ComplexSetupItem083(),
            new ComplexSetupItem084(),

            // BATTLE
            new SetupItem045(),
            new SetupItem074(),
            new SetupItem086(),
            new SetupItem087(),

            new ComplexSetupItem002(),
            new SetupItem003(),
            new SetupItem004(),
            new SetupItem005(),
            new SetupItem056(),
            new SetupItem064(),
            new SetupItem071(),

            // MISC
            new SetupItem078(),
            new SetupItem044(),
            new SetupItem069(),
            new SetupItem073(),
            new SetupItem076(),
            new SetupItem085(),
            new SetupItem088(),
        ];
    }

    getSetupItem() {
        return this.#setupItemList;
    }

    static getInstance() {
        return instance;
    }
}

const instance = new SetupItemManager();

export = SetupItemManager;