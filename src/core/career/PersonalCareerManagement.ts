import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import {PersonalStatus} from "../role/PersonalStatus";
import Role from "../role/Role";
import CareerChangeLog from "./CareerChangeLog";
import CareerChangeLogStorage from "./CareerChangeLogStorage";
import PersonalCareerManagementPage from "./PersonalCareerManagementPage";
import PersonalCareerManagementPageParser from "./PersonalCareerManagementPageParser";

class PersonalCareerManagement {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalCareerManagementPage> {
        return await (() => {
            return new Promise<PersonalCareerManagementPage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "CHANGE_OCCUPATION");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalCareerManagementPageParser.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async transfer(careerId: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                new PersonalStatus(this.#credential, this.#townId)
                    .load()
                    .then(before => {
                        const request = this.#credential.asRequestMap();
                        request.set("chara", "1");
                        request.set("mode", "JOB_CHANGE");
                        request.set("syoku_no", careerId.toString());
                        NetworkUtils.post("mydata.cgi", request)
                            .then(html => {
                                MessageBoard.processResponseMessage(html);
                                // 不需要额外的清理RoleStatus缓存数据了
                                new PersonalStatus(this.#credential, this.#townId)
                                    .load()
                                    .then(after => {
                                        this.#postTransfer(before, after, () => resolve());
                                    });
                            });
                    });

            });
        })();
    }

    #postTransfer(before: Role, after: Role, handler: () => void) {
        if (before.level! !== after.level! && after.level! === 1) {
            // 成功完成了转职操作
            const data = new CareerChangeLog();
            data.roleId = this.#credential.id;
            data.career_1 = before.career;
            data.level_1 = before.level;
            data.health_1 = before.maxHealth;
            data.mana_1 = before.maxMana;
            data.attack_1 = before.attack;
            data.defense_1 = before.defense;
            data.specialAttack_1 = before.specialAttack;
            data.specialDefense_1 = before.specialDefense;
            data.speed_1 = before.speed;
            data.career_2 = after.career;
            data.level_2 = after.level;
            data.health_2 = after.maxHealth;
            data.mana_2 = after.maxMana;
            data.attack_2 = after.attack;
            data.defense_2 = after.defense;
            data.specialAttack_2 = after.specialAttack;
            data.specialDefense_2 = after.specialDefense;
            data.speed_2 = after.speed;
            // 保存转职的记录
            CareerChangeLogStorage.getInstance().insert(data).then(() => handler());
        } else {
            // 没有转职，大概率是由于需要转职任务引发的
            handler();
        }
    }

}

export = PersonalCareerManagement;