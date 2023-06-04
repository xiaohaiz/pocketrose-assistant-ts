import Role from "../common/Role";
import RoleCareerTransfer from "../core/role/RoleCareerTransfer";
import RoleStorageManager from "../core/role/RoleStorageManager";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import PersonalCareerManagementPage from "./PersonalCareerManagementPage";
import PersonalStatus from "./PersonalStatus";

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
                    const page = PersonalCareerManagement.parsePage(html);
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
            const data = new RoleCareerTransfer();
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
            RoleStorageManager.getRoleCareerTransferStorage()
                .write(data)
                .then(() => {
                    handler();
                });
        } else {
            // 没有转职，大概率是由于需要转职任务引发的
            handler();
        }
    }

    static parsePage(html: string) {
        const role = new Role();
        $(html).find("input:radio:first")
            .parent()
            .next()         // name
            .each((idx, td) => {
                role.name = $(td).text();
            })
            .next()         // level
            .each((idx, td) => {
                role.level = parseInt($(td).text());
            })
            .next()         // health
            .each((idx, td) => {
                role.parseHealth($(td).text());
            })
            .next()         // mana
            .each((idx, td) => {
                role.parseMana($(td).text());
            })
            .next()         // attribute
            .each((idx, td) => {
                role.attribute = $(td).text();
            })
            .next()         // career
            .each((idx, td) => {
                role.career = $(td).text();
            })
            .parent()
            .find("td:first")
            .next()         // cash
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                role.cash = parseInt(s);
            });

        const careerCandidateList: string[] = [];
        $(html)
            .find("select[name='syoku_no']")
            .find("option")
            .each(function (_idx, option) {
                const value = $(option).val();
                if (value !== "") {
                    const career = $(option).text().trim();
                    careerCandidateList.push(career);
                }
            });

        const page = new PersonalCareerManagementPage();
        page.role = role;
        page.careerList = careerCandidateList;
        return page;
    }

}

export = PersonalCareerManagement;