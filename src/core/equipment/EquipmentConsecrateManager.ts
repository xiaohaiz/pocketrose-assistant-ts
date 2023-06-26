import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
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
                        .then(() => resolve())
                        .catch(() => resolve());
                }
            });
        });
    }
}

export = EquipmentConsecrateManager;