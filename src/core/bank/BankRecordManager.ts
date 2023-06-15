import _ from "lodash";
import TownBank from "../../pocketrose/TownBank";
import Credential from "../../util/Credential";
import DayRange from "../../util/DayRange";
import BankRecord from "./BankRecord";
import BankStorages from "./BankStorages";

class BankRecordManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
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
                        BankStorages.bankRecordStorage.upsert(data).then(() => resolve());
                    }
                });

            });
        })();
    }
}

export = BankRecordManager;