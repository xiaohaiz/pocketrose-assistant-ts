import ComplexSetupItem002 from "./battle/ComplexSetupItem002";
import ComplexSetupItem003 from "./battle/ComplexSetupItem003";
import ComplexSetupItem004 from "./battle/ComplexSetupItem004";
import ComplexSetupItem005 from "./battle/ComplexSetupItem005";
import ComplexSetupItem054 from "./ui/ComplexSetupItem054";
import ComplexSetupItem056 from "./battle/ComplexSetupItem056";
import ComplexSetupItem064 from "./battle/ComplexSetupItem064";
import SetupItem from "./SetupItem";
import {ComplexSetupItem036} from "./ui/ComplexSetupItem036";
import {ComplexSetupItem041} from "./ui/ComplexSetupItem041";
import {ComplexSetupItem071} from "./battle/ComplexSetupItem071";
import {ComplexSetupItem083} from "./ui/ComplexSetupItem083";
import {ComplexSetupItem084} from "./ui/ComplexSetupItem084";
import {ComplexSetupItem099} from "./misc/ComplexSetupItem099";
import {SetupItem001} from "./ui/SetupItem001";
import {SetupItem026} from "./ui/SetupItem026";
import {SetupItem028} from "./ui/SetupItem028";
import {SetupItem035} from "./ui/SetupItem035";
import {SetupItem038} from "./ui/SetupItem038";
import {SetupItem043} from "./ui/SetupItem043";
import {SetupItem044} from "./misc/SetupItem044";
import {SetupItem045} from "./battle/SetupItem045";
import {SetupItem048} from "./ui/SetupItem048";
import {SetupItem057} from "./ui/SetupItem057";
import {SetupItem058} from "./ui/SetupItem058";
import {SetupItem062} from "./ui/SetupItem062";
import {SetupItem072} from "./ui/SetupItem072";
import {SetupItem074} from "./battle/SetupItem074";
import {SetupItem075} from "./ui/SetupItem075";
import {SetupItem076} from "./misc/SetupItem076";
import {SetupItem077} from "./ui/SetupItem077";
import {SetupItem078} from "./misc/SetupItem078";
import {SetupItem080} from "./ui/SetupItem080";
import {SetupItem082} from "./ui/SetupItem082";
import {SetupItem086} from "./battle/SetupItem086";
import {SetupItem091} from "./battle/SetupItem091";
import {SetupItem094} from "./misc/SetupItem094";
import {SetupItem098} from "./misc/SetupItem098";
import {SetupItem100} from "./misc/SetupItem100";

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
            new SetupItem082(),
            new SetupItem080(),
            new ComplexSetupItem036(),
            new ComplexSetupItem041(),
            new ComplexSetupItem054(),
            new ComplexSetupItem083(),
            new ComplexSetupItem084(),

            // BATTLE
            new SetupItem045(),
            new SetupItem074(),
            new SetupItem086(),
            new SetupItem091(),
            new ComplexSetupItem002(),
            new ComplexSetupItem003(),
            new ComplexSetupItem004(),
            new ComplexSetupItem005(),
            new ComplexSetupItem056(),
            new ComplexSetupItem064(),
            new ComplexSetupItem071(),

            // MISC
            new SetupItem078(),
            new SetupItem044(),
            new SetupItem076(),
            new SetupItem094(),
            new SetupItem098(),
            new SetupItem100(),
            new ComplexSetupItem099(),
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