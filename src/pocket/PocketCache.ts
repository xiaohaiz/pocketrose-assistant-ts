import {PocketDatabase} from "./PocketDatabase";
import {DayRange} from "../util/PocketDateUtils";

class PocketCache {

    static async loadCacheObject(id: string): Promise<CacheObject | null> {
        const object = await CacheObjectStorage.load(id);
        if (object !== null && object.expired) return null;
        return object;
    }

    static async writeCacheObject(id: string, json: string, ttlInMillis?: number) {
        const object = new CacheObject();
        object.id = id;
        object.createTime = Date.now();
        if (ttlInMillis !== undefined) object.ttlInMillis = ttlInMillis;
        object.json = json;
        await CacheObjectStorage.write(object);
    }

    static async deleteCacheObject(id: string) {
        await CacheObjectStorage.delete(id);
    }

    static expirationUntilTomorrow() {
        const now = Date.now();
        return new DayRange(now).next().start - now;
    }
}

class CacheObject {

    id?: string;
    createTime?: number;
    ttlInMillis?: number;
    json?: string;

    get expired() {
        if (this.createTime === undefined || this.ttlInMillis === undefined) return false;
        if (this.ttlInMillis <= 0) return false;
        return this.createTime + this.ttlInMillis < Date.now();
    }

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.ttlInMillis !== undefined) && (document.ttlInMillis = this.ttlInMillis);
        (this.json) && (document.json = this.json);
        return document;
    }
}

class CacheObjectStorage {

    static async load(id: string): Promise<CacheObject | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<CacheObject | null>((resolve, reject) => {
                const request = db
                    .transaction(["PocketCacheObject"], "readonly")
                    .objectStore("PocketCacheObject")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    let object: CacheObject | null = null;
                    if (request.result) {
                        object = new CacheObject();
                        object.id = request.result.id;
                        object.createTime = request.result.createTime;
                        object.ttlInMillis = request.result.ttlInMillis;
                        object.json = request.result.json;
                    }
                    resolve(object);
                };
            });
        })();
    }

    static async write(object: CacheObject) {
        const document = object.asDocument();
        document.createTime = Date.now();
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["PocketCacheObject"], "readwrite")
                .objectStore("PocketCacheObject")
                .put(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    static async delete(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["PocketCacheObject"], "readwrite")
                .objectStore("PocketCacheObject")
                .delete(id)
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }
}

export {PocketCache, CacheObject};