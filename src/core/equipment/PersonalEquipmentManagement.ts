import _ from "lodash";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import OperationMessage from "../../util/OperationMessage";
import PersonalStatus from "../role/PersonalStatus";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import TreasureBag from "./TreasureBag";
import PersonalEquipmentManagementPageParser from "./PersonalEquipmentManagementPageParser";

class PersonalEquipmentManagement {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalEquipmentManagementPage> {
        const action = () => {
            return new Promise<PersonalEquipmentManagementPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "USE_ITEM");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalEquipmentManagementPageParser.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }

    async use(indexList: number[]): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("chara", "1");
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                request.set("word", "");
                request.set("mode", "USE");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }

    /**
     * 将身上的闲置装备全部放入百宝袋。
     */
    async putIdleEquipmentIntoTreasureBag(): Promise<OperationMessage> {
        const equipmentPage = await this.open();
        const indexList = _.forEach(equipmentPage.equipmentList!)
            .filter(it => it.isIdle)
            .map(it => it.index!);
        if (indexList.length === 0) {
            MessageBoard.publishWarning("没有发现闲置装备！");
            return OperationMessage.failure();
        }
        let hasTreasureBag = true;
        if (equipmentPage.findTreasureBag() === null) {
            const role = await new PersonalStatus(this.#credential).load();
            hasTreasureBag = role.masterCareerList!.includes("剑圣") || role.hasMirror!;
            if (hasTreasureBag) {
                MessageBoard.publishWarning("真可怜，百宝袋丢失了吧。但是百宝袋功能还是能为你有限提供的。");
            }
        }
        if (!hasTreasureBag) {
            MessageBoard.publishWarning("对不起，你好像就没有百宝袋！");
            return OperationMessage.failure();
        }
        await new TreasureBag(this.#credential).putInto(indexList);
        const message = OperationMessage.success();
        message.doRefresh = true;
        return message;
    }
}

export = PersonalEquipmentManagement;