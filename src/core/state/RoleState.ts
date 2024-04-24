import Coordinate from "../../util/Coordinate";
import {PocketDatabase} from "../../pocket/PocketDatabase";

class RoleState {

    id?: string;
    updateTime?: number;
    location?: string;
    townId?: string;
    battleCount?: number;
    castleName?: string;
    coordinate?: string;
    roleLevel?: number;
    roleCareer?: string;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.location) && (document.location = this.location);
        (this.townId) && (document.townId = this.townId);
        (this.battleCount !== undefined) && (document.battleCount = this.battleCount);
        (this.castleName) && (document.castleName = this.castleName);
        (this.coordinate) && (document.coordinate = this.coordinate);
        (this.roleLevel !== undefined) && (document.roleLevel = this.roleLevel);
        (this.roleCareer) && (document.roleCareer = this.roleCareer);
        return document;
    }

    asCoordinate(): Coordinate | undefined {
        if (this.coordinate === undefined) {
            return undefined;
        }
        return Coordinate.parse(this.coordinate);
    }

}

class RoleStateStorage {

    static async load(id: string): Promise<RoleState | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleState | null>((resolve, reject) => {
                const request = db
                    .transaction(["RoleState"], "readonly")
                    .objectStore("RoleState")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new RoleState();
                        record.id = request.result.id;
                        record.updateTime = request.result.updateTime;
                        record.location = request.result.location;
                        record.townId = request.result.townId;
                        record.battleCount = request.result.battleCount;
                        record.castleName = request.result.castleName;
                        record.coordinate = request.result.coordinate;
                        record.roleLevel = request.result.roleLevel;
                        record.roleCareer = request.result.roleCareer;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async write(record: RoleState): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                document.updateTime = Date.now();
                const request = db
                    .transaction(["RoleState"], "readwrite")
                    .objectStore("RoleState")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

export {RoleState, RoleStateStorage};
