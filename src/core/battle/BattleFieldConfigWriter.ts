import Credential from "../../util/Credential";
import BattleFieldConfig from "./BattleFieldConfig";
import StorageUtils from "../../util/StorageUtils";

class BattleFieldConfigWriter {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async writeCustomizedConfig(primary: boolean,
                          junior: boolean,
                          senior: boolean,
                          zodiac: boolean) {

        const config = new BattleFieldConfig();
        config.primary = primary;
        config.junior = junior;
        config.senior = senior;
        config.zodiac = zodiac;
        const document = config.asDocument();

        const key = "_pa_012_" + this.#credential.id;
        StorageUtils.set(key, JSON.stringify(document));
    }

}

export = BattleFieldConfigWriter;