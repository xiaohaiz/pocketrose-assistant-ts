import PocketDatabase from "../core/PocketDatabase";

class RolePetStatusStorage {

    async write(id: string, json: string): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = {};
                // @ts-ignore
                document.id = id;
                // @ts-ignore
                document.json = json;
                // @ts-ignore
                document.updateTime = new Date().getTime();

                const request = db.transaction(["RolePetStatus"], "readwrite")
                    .objectStore("RolePetStatus")
                    .put(document);

                request.onerror = reject;

                request.onsuccess = () => resolve();
            });
        })();
    }
}

export = RolePetStatusStorage;