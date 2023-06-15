import BankRecordStorage from "./BankRecordStorage";

class BankStorages {

    static get bankRecordStorage(): BankRecordStorage {
        return bankRecordStorage;
    }

}

const bankRecordStorage = new BankRecordStorage();

export = BankStorages;