import PocketDatabase from "../core/PocketDatabase";
import RoleCareerTransfer from "./RoleCareerTransfer";

class RoleCareerTransferStorage {

    async write(data: RoleCareerTransfer): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = {};
                // @ts-ignore
                document.roleId = data.roleId;
                // @ts-ignore
                document.createTime = new Date().getTime();

                // @ts-ignore
                document.career_1 = data.career_1;
                // @ts-ignore
                document.level_1 = data.level_1;
                // @ts-ignore
                document.health_1 = data.health_1;
                // @ts-ignore
                document.mana_1 = data.mana_1;
                // @ts-ignore
                document.attack_1 = data.attack_1;
                // @ts-ignore
                document.defense_1 = data.defense_1;
                // @ts-ignore
                document.specialAttack_1 = data.specialAttack_1;
                // @ts-ignore
                document.specialDefense_1 = data.specialDefense_1;
                // @ts-ignore
                document.speed_1 = data.speed_1;

                // @ts-ignore
                document.career_2 = data.career_2;
                // @ts-ignore
                document.level_2 = data.level_2;
                // @ts-ignore
                document.health_2 = data.health_2;
                // @ts-ignore
                document.mana_2 = data.mana_2;
                // @ts-ignore
                document.attack_2 = data.attack_2;
                // @ts-ignore
                document.defense_2 = data.defense_2;
                // @ts-ignore
                document.specialAttack_2 = data.specialAttack_2;
                // @ts-ignore
                document.specialDefense_2 = data.specialDefense_2;
                // @ts-ignore
                document.speed_2 = data.speed_2;

                const request = db
                    .transaction(["RoleCareerTransfer"], "readwrite")
                    .objectStore("RoleCareerTransfer")
                    .add(document);

                request.onerror = reject;

                request.onsuccess = () => resolve();
            });
        })();
    }

}

export = RoleCareerTransferStorage;