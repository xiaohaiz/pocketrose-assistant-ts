import Spell from "../common/Spell";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import PersonalSpellPage from "./PersonalSpellPage";

class PersonalSpell {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalSpellPage> {
        return await (() => {
            return new Promise<PersonalSpellPage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "MAGIC");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalSpell.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async set(spellId: string): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("ktec_no", spellId);
                request.set("mode", "MAGIC_SET");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }

    static parsePage(html: string) {
        const spellList: Spell[] = [];
        const select = $(html).find("select[name='ktec_no']");
        $(select).find("option").each(function (_idx, option) {
            const spell = new Spell();
            const id = $(option).val();
            if (id !== "") {
                spell.id = id as string;
                let s = $(option).text().trim();
                spell.name = StringUtils.substringBefore(s, "(");
                s = StringUtils.substringBetween(s, "(", ")");
                const ss = s.split(" | ");
                spell.power = parseInt(StringUtils.substringAfter(ss[0], "威力:"));
                spell.accuracy = parseInt(StringUtils.substringAfter(ss[1], "确率:"));
                spell.pp = parseInt(StringUtils.substringAfter(ss[2], "消费MP:"));
                spellList.push(spell);
            }
        });

        const page = new PersonalSpellPage();
        page.spellList = spellList;
        return page;
    }
}

export = PersonalSpell;