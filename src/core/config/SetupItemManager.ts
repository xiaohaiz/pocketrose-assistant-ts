import SetupItem001 from "./internal/SetupItem001";
import SetupItem002 from "./internal/SetupItem002";
import SetupItem003 from "./internal/SetupItem003";
import SetupItem004 from "./internal/SetupItem004";
import SetupItem005 from "./internal/SetupItem005";
import SetupItem026 from "./internal/SetupItem026";
import SetupItem028 from "./internal/SetupItem028";
import SetupItem035 from "./internal/SetupItem035";
import SetupItem036 from "./internal/SetupItem036";
import SetupItem037 from "./internal/SetupItem037";
import SetupItem038 from "./internal/SetupItem038";
import SetupItem040 from "./internal/SetupItem040";
import SetupItem041 from "./internal/SetupItem041";
import SetupItem042 from "./internal/SetupItem042";
import SetupItem043 from "./internal/SetupItem043";
import SetupItem044 from "./internal/SetupItem044";
import SetupItem048 from "./internal/SetupItem048";
import SetupItem050 from "./internal/SetupItem050";
import SetupItem052 from "./internal/SetupItem052";
import SetupItem053 from "./internal/SetupItem053";
import SetupItem054 from "./internal/SetupItem054";
import SetupItem056 from "./internal/SetupItem056";
import SetupItem057 from "./internal/SetupItem057";
import SetupItem058 from "./internal/SetupItem058";
import SetupItem062 from "./internal/SetupItem062";
import SetupItem064 from "./internal/SetupItem064";
import SetupItem069 from "./internal/SetupItem069";
import SetupItem from "./SetupItem";
import {SetupItem071} from "./internal/SetupItem071";
import {SetupItem045} from "./internal/SetupItem045";
import {SetupItem046} from "./internal/SetupItem046";
import {SetupItem072} from "./internal/SetupItem072";
import {SetupItem073} from "./internal/SetupItem073";

class SetupItemManager {

    readonly #setupItemList: SetupItem[];

    constructor() {
        this.#setupItemList = [
            new SetupItem001(),
            new SetupItem002(),
            new SetupItem003(),
            new SetupItem004(),
            new SetupItem005(),
            new SetupItem056(),
            new SetupItem026(),
            new SetupItem028(),
            new SetupItem035(),
            new SetupItem036(),
            new SetupItem037(),
            new SetupItem038(),
            new SetupItem041(),
            new SetupItem054(),
            new SetupItem050(),
            new SetupItem042(),
            new SetupItem043(),
            new SetupItem044(),
            new SetupItem048(),
            new SetupItem052(),
            new SetupItem053(),
            new SetupItem040(),
            new SetupItem045(),
            new SetupItem046(),
            new SetupItem057(),
            new SetupItem058(),
            new SetupItem064(),
            new SetupItem062(),
            new SetupItem069(),
            new SetupItem071(),
            new SetupItem072(),
            new SetupItem073(),
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