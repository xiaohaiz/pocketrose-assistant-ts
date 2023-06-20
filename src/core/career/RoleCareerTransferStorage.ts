import PocketDatabase from "../../util/PocketDatabase";
import RoleCareerTransfer from "./RoleCareerTransfer";

class RoleCareerTransferStorage {

    async delete(id: number) {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["RoleCareerTransfer"], "readwrite")
                .objectStore("RoleCareerTransfer")
                .delete(id);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async loads(): Promise<RoleCareerTransfer[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleCareerTransfer[]>((resolve, reject) => {
                const request = db
                    .transaction(["RoleCareerTransfer"], "readonly")
                    .objectStore("RoleCareerTransfer")
                    .getAll();
                request.onerror = reject;
                request.onsuccess = () => {
                    const dataList: RoleCareerTransfer[] = [];
                    if (request.result) {
                        for (const it of request.result) {
                            const data = new RoleCareerTransfer();
                            data.id = it.id;
                            data.roleId = it.roleId;
                            data.createTime = it.createTime;
                            data.career_1 = it.career_1;
                            data.level_1 = it.level_1;
                            data.health_1 = it.health_1;
                            data.mana_1 = it.mana_1;
                            data.attack_1 = it.attack_1;
                            data.defense_1 = it.defense_1;
                            data.specialAttack_1 = it.specialAttack_1;
                            data.specialDefense_1 = it.specialDefense_1;
                            data.speed_1 = it.speed_1;
                            data.career_2 = it.career_2;
                            data.level_2 = it.level_2;
                            data.health_2 = it.health_2;
                            data.mana_2 = it.mana_2;
                            data.attack_2 = it.attack_2;
                            data.defense_2 = it.defense_2;
                            data.specialAttack_2 = it.specialAttack_2;
                            data.specialDefense_2 = it.specialDefense_2;
                            data.speed_2 = it.speed_2;
                            dataList.push(data);
                        }
                    }
                    resolve(dataList);
                };
            });
        })();
    }

}

export = RoleCareerTransferStorage;