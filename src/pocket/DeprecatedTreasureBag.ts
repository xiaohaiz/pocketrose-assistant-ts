import Equipment from "../common/Equipment";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import EquipmentParser from "./EquipmentParser";

class DeprecatedTreasureBag {

    readonly #credential: Credential;
    readonly #treasureBagIndex: number;

    constructor(credential: Credential, treasureBagIndex: number) {
        this.#credential = credential;
        this.#treasureBagIndex = treasureBagIndex;
    }

    async open(): Promise<Equipment[]> {
        const action = (credential: Credential, treasureBagIndex: number) => {
            return new Promise<Equipment[]>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["chara"] = "1";
                // @ts-ignore
                request["item" + treasureBagIndex] = treasureBagIndex;
                // @ts-ignore
                request["mode"] = "USE";
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                    const equipmentList = EquipmentParser.parseTreasureBagItemList(html);
                    MessageBoard.publishMessage("在百宝袋中检索到" + equipmentList.length + "件装备。")
                    resolve(equipmentList);
                });
            });
        };
        return await action(this.#credential, this.#treasureBagIndex);
    }

    async putInto(indexList: number[]): Promise<void> {
        const action = (credential: Credential, indexList: number[]) => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                }
                const request = credential.asRequestMap();
                request.set("chara", "1");
                request.set("mode", "PUTINBAG");
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                NetworkUtils.post("mydata.cgi", request)
                    .then(html => {
                        MessageBoard.processResponseMessage(html);
                        resolve();
                    });
            });
        };
        return await action(this.#credential, indexList);
    }

    async takeOut(indexList: number[]): Promise<void> {
        const action = (credential: Credential) => {
            return new Promise<void>(resolve => {
                if (indexList.length === 0) {
                    resolve();
                } else {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["mode"] = "GETOUTBAG";
                    for (const index of indexList) {
                        // @ts-ignore
                        request["item" + index] = index;
                    }
                    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                        MessageBoard.processResponseMessage(html);
                        resolve();
                    });
                }
            });
        };
        return await action(this.#credential);
    }
}

export = DeprecatedTreasureBag;