import LastLoginStorage from "./LastLoginStorage";

class TeamStorages {

    static get lastLoginStorage(): LastLoginStorage {
        return lastLoginStorage;
    }

}

const lastLoginStorage = new LastLoginStorage();

export = TeamStorages;