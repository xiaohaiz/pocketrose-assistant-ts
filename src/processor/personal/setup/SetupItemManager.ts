import SetupItem from "./SetupItem";
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
import SetupItem011 from "./internal/SetupItem011";
import SetupItem012 from "./internal/SetupItem012";
import SetupItem013 from "./internal/SetupItem013";
import SetupItem014 from "./internal/SetupItem014";
import SetupItem015 from "./internal/SetupItem015";
import SetupItem016 from "./internal/SetupItem016";
import SetupItem017 from "./internal/SetupItem017";
import SetupItem018 from "./internal/SetupItem018";
import SetupItem019 from "./internal/SetupItem019";
import SetupItem020 from "./internal/SetupItem020";
import SetupItem021 from "./internal/SetupItem021";
import SetupItem022 from "./internal/SetupItem022";
import SetupItem023 from "./internal/SetupItem023";
import SetupItem024 from "./internal/SetupItem024";
import SetupItem025 from "./internal/SetupItem025";
import SetupItem026 from "./internal/SetupItem026";
import SetupItem027 from "./internal/SetupItem027";
import SetupItem028 from "./internal/SetupItem028";
import SetupItem029 from "./internal/SetupItem029";
import SetupItem030 from "./internal/SetupItem030";

class SetupItemManager {

    readonly #setupItemList: SetupItem[];

    constructor() {
        this.#setupItemList = [
            new SetupItem012(),
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
            new SetupItem011(),
            new SetupItem013(),
            new SetupItem014(),
            new SetupItem015(),
            new SetupItem016(),
            new SetupItem017(),
            new SetupItem018(),
            new SetupItem019(),
            new SetupItem020(),
            new SetupItem021(),
            new SetupItem022(),
            new SetupItem023(),
            new SetupItem024(),
            new SetupItem025(),
            new SetupItem026(),
            new SetupItem027(),
            new SetupItem028(),
            new SetupItem030(),
        ];
    }

    getSetupItem() {
        return this.#setupItemList;
    }

}

export = SetupItemManager;