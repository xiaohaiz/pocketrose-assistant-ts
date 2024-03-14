import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import BattleFieldConfigLoader from "../battle/BattleFieldConfigLoader";
import BattleFieldConfigWriter from "../battle/BattleFieldConfigWriter";
import EquipmentConsecrateLog from "./EquipmentConsecrateLog";
import EquipmentConsecrateLogStorage from "./EquipmentConsecrateLogStorage";

class EquipmentConsecrateManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async consecrate(indexList: number[], nameList?: string[]) {
        const request = this.#credential.asRequestMap();
        request.set("chara", "1");
        request.set("mode", "CONSECRATE");
        indexList.forEach(it => {
            request.set("item" + it, it.toString());
        });
        return new Promise<void>(resolve => {
            NetworkUtils.post("mydata.cgi", request).then(html => {
                MessageBoard.processResponseMessage(html);
                if ($(html).text().includes("ERROR !")) {
                    resolve();
                } else {
                    const log = new EquipmentConsecrateLog();
                    log.roleId = this.#credential.id;
                    (nameList) && (log.equipments = _.join(nameList));
                    EquipmentConsecrateLogStorage.getInstance()
                        .insert(log)
                        .then(() => {
                            this.#autoSetBattleField().then(() => resolve());
                        })
                        .catch(() => {
                            this.#autoSetBattleField().then(() => resolve());
                        });
                }
            });
        });
    }

    async #autoSetBattleField() {
        if (BattleFieldConfigLoader.isAutoSetEnabled()) {
            const writer = new BattleFieldConfigWriter(this.#credential);
            await writer.writeCustomizedConfig(false, false, true, false);
            MessageBoard.processResponseMessage("战斗场所自动切换为【上级之洞窟】！");
        }
    }
}

export = EquipmentConsecrateManager;