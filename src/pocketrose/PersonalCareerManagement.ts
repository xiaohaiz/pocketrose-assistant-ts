import Role from "../common/Role";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import PersonalCareerManagementPage from "./PersonalCareerManagementPage";

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
                const request = this.#credential.asRequestMap();
                request.set("chara", "1");
                request.set("mode", "JOB_CHANGE");
                request.set("syoku_no", careerId.toString());
                NetworkUtils.post("mydata.cgi", request)
                    .then(html => {
                        MessageBoard.processResponseMessage(html);
                        resolve();
                    });
            });
        })();
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