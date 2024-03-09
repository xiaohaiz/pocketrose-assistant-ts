import _ from "lodash";
import Credential from "../../util/Credential";
import DayRange from "../../util/DayRange";
import BankRecord from "./BankRecord";
import BankRecordStorage from "./BankRecordStorage";
import TownBank from "./TownBank";

class BankRecordManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerUpdateBankRecord(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                // 战数尾数为73时，触发资产更新
                const doUpdate = (battleCount % 100 === 73);
                if (doUpdate) {
                    this.updateBankRecord().then(() => resolve());
                } else {
                    resolve();
                }
            });
        })();
    }

    async updateBankRecord(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {

                new TownBank(this.#credential).load().then(account => {
                    if (_.isNaN(account.cash) || _.isNaN(account.saving)) {
                        // Do nothing and return
                        resolve();
                    } else {
                        const data = new BankRecord();
                        data.roleId = this.#credential.id;
                        data.recordDate = DayRange.current().asText();
                        data.cash = account.cash;
                        data.saving = account.saving;
                        BankRecordStorage.getInstance().upsert(data).then(() => resolve());
                    }
                });

            });
        })();
    }

    static async importFromJson(json: string) {
        const documentList = JSON.parse(json);
        $("#bankRecordCount").html(documentList.length);
        if (documentList.length > 0) doImport(0, documentList);
    }
}

function doImport(index: number, documentList: {}[]) {
    const document = documentList[index];
    if (!document) {
        return;
    }
    const data = new BankRecord();
    // @ts-ignore
    data.id = document.id;
    // @ts-ignore
    data.roleId = document.roleId;
    // @ts-ignore
    data.createTime = document.createTime;
    // @ts-ignore
    data.updateTime = document.updateTime;
    // @ts-ignore
    data.recordDate = document.recordDate;
    // @ts-ignore
    data.cash = document.cash;
    // @ts-ignore
    data.saving = document.saving;
    // @ts-ignore
    data.revision = document.revision;

    BankRecordStorage.getInstance().replay(data)
        .then(() => {
            let c = _.parseInt($("#importedBankRecordCount").text());
            c++;
            $("#importedBankRecordCount").text(c);
            doImport(index + 1, documentList);
        })
        .catch(() => {
            let c = _.parseInt($("#duplicatedBankRecordCount").text());
            c++;
            $("#duplicatedBankRecordCount").text(c);
            doImport(index + 1, documentList);
        });
}

export = BankRecordManager;