class GemFuseLogStorage {

    static getInstance() {
        return instance;
    }

}

const instance = new GemFuseLogStorage();

export = GemFuseLogStorage;