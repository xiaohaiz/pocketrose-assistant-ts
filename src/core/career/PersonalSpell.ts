import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StringUtils from "../../util/StringUtils";
import PersonalSpellPage from "./PersonalSpellPage";
import Spell from "./Spell";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("SPELL");

class PersonalSpell {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalSpellPage> {
        logger.debug("Loading spell page...");
        const request = this.#credential.asRequest();
        if (this.#townId !== undefined) {
            request.set("town", this.#townId);
        }
        request.set("mode", "MAGIC");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalSpell.parsePage(response.html);
        response.touch();
        logger.debug("Spell page loaded.", response.durationInMillis);
        return page;
    }

    async set(spellId: string): Promise<void> {
        const request = this.#credential.asRequest();
        request.set("ktec_no", spellId);
        request.set("mode", "MAGIC_SET");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
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