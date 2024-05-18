import Credential from "../../util/Credential";
import EquipmentConsecrateLog from "./EquipmentConsecrateLog";
import EquipmentConsecrateLogStorage from "./EquipmentConsecrateLogStorage";
import MessageBoard from "../../util/MessageBoard";
import _ from "lodash";
import {BattleConfigManager} from "../../setup/ConfigManager";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("EQUIPMENT");

class EquipmentConsecrateManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async consecrate(indexList: number[], nameList?: string[]) {
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        request.set("mode", "CONSECRATE");
        indexList.forEach(it => {
            request.set("item" + it, it.toString());
        });
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        if (_.includes(response.html, "ERROR !")) {
            return;
        }
        const log = new EquipmentConsecrateLog();
        log.roleId = this.#credential.id;
        (nameList) && (log.equipments = _.join(nameList));
        await EquipmentConsecrateLogStorage.getInstance().insert(log);
        logger.debug("Equipment consecrate log saved into IndexedDB.");
        await this.#autoSetBattleField();
    }

    async #autoSetBattleField() {
        if (!BattleConfigManager.loadGlobalBattleFieldConfig().configured) {
            const configManager = new BattleConfigManager(this.#credential);
            configManager.setPersonalBattleFieldConfig(false, false, true, false);
            MessageBoard.publishMessage("战斗场所自动切换为【上级之洞窟】！");
        }
    }
}

export = EquipmentConsecrateManager;