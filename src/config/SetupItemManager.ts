import SetupItem001 from "./internal/SetupItem001";
import SetupItem002 from "./internal/SetupItem002";
import SetupItem003 from "./internal/SetupItem003";
import SetupItem004 from "./internal/SetupItem004";
import SetupItem005 from "./internal/SetupItem005";
import SetupItem006 from "./internal/SetupItem006";
import SetupItem007 from "./internal/SetupItem007";
import SetupItem008 from "./internal/SetupItem008";
import SetupItem009 from "./internal/SetupItem009";
import SetupItem010 from "./internal/SetupItem010";
import SetupItem012 from "./internal/SetupItem012";
import SetupItem013 from "./internal/SetupItem013";
import SetupItem014 from "./internal/SetupItem014";
import SetupItem019 from "./internal/SetupItem019";
import SetupItem020 from "./internal/SetupItem020";
import SetupItem021 from "./internal/SetupItem021";
import SetupItem022 from "./internal/SetupItem022";
import SetupItem023 from "./internal/SetupItem023";
import SetupItem024 from "./internal/SetupItem024";
import SetupItem025 from "./internal/SetupItem025";
import SetupItem026 from "./internal/SetupItem026";
import SetupItem028 from "./internal/SetupItem028";
import SetupItem029 from "./internal/SetupItem029";
import SetupItem030 from "./internal/SetupItem030";
import SetupItem035 from "./internal/SetupItem035";
import SetupItem036 from "./internal/SetupItem036";
import SetupItem037 from "./internal/SetupItem037";
import SetupItem038 from "./internal/SetupItem038";
import SetupItem039 from "./internal/SetupItem039";
import SetupItem040 from "./internal/SetupItem040";
import SetupItem041 from "./internal/SetupItem041";
import SetupItem042 from "./internal/SetupItem042";
import SetupItem043 from "./internal/SetupItem043";
import SetupItem044 from "./internal/SetupItem044";
import SetupItem045 from "./internal/SetupItem045";
import SetupItem046 from "./internal/SetupItem046";
import SetupItem047 from "./internal/SetupItem047";
import SetupItem048 from "./internal/SetupItem048";
import SetupItem049 from "./internal/SetupItem049";
import SetupItem050 from "./internal/SetupItem050";
import SetupItem052 from "./internal/SetupItem052";
import SetupItem053 from "./internal/SetupItem053";
import SetupItem054 from "./internal/SetupItem054";
import SetupItem056 from "./internal/SetupItem056";
import SetupItem from "./SetupItem";

class SetupItemManager {

    readonly #setupItemList: SetupItem[];

    constructor() {
        this.#setupItemList = [
            new SetupItem012(),
            new SetupItem056(),
            new SetupItem029(),
            new SetupItem001(),
            new SetupItem002(),
            new SetupItem003(),
            new SetupItem004(),
            new SetupItem005(),
            new SetupItem006(),
            new SetupItem007(),
            new SetupItem008(),
            new SetupItem009(),
            new SetupItem010(),
            new SetupItem013(),
            new SetupItem014(),
            new SetupItem019(),
            new SetupItem020(),
            new SetupItem021(),
            new SetupItem022(),
            new SetupItem023(),
            new SetupItem024(),
            new SetupItem025(),
            new SetupItem026(),
            new SetupItem028(),
            new SetupItem030(),
            new SetupItem035(),
            new SetupItem036(),
            new SetupItem037(),
            new SetupItem038(),
            new SetupItem039(),
            new SetupItem046(),
            new SetupItem047(),
            new SetupItem041(),
            new SetupItem054(),
            new SetupItem050(),
            new SetupItem042(),
            new SetupItem043(),
            new SetupItem044(),
            new SetupItem048(),
            new SetupItem049(),
            new SetupItem052(),
            new SetupItem053(),
            new SetupItem040(),
            new SetupItem045(),
        ];
    }

    getSetupItem() {
        return this.#setupItemList;
    }

}

export = SetupItemManager;