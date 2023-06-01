class PocketDB {

    readonly #storeName: string;

    constructor(storeName: string) {
        this.#storeName = storeName;
    }

    connectDB = () => {

        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB.open("pocketrose");

            request.onerror = reject;

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = event => {
                // @ts-ignore
                const db: IDBDatabase = event.target.result;

                if (!db.objectStoreNames.contains(this.#storeName)) {
                    const store = db.createObjectStore(this.#storeName, {keyPath: "id", autoIncrement: false});
                }

                resolve(this.connectDB());
            };
        });

    };


}

export = PocketDB;