import Credential from "../../util/Credential";
import GoldenCagePage from "./GoldenCagePage";
import MessageBoard from "../../util/MessageBoard";
import Pet from "./Pet";
import StringUtils from "../../util/StringUtils";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("CAGE");

class GoldenCage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(cageIndex: number): Promise<GoldenCagePage> {
        logger.debug("Loading golden cage page...");
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        request.set("item" + cageIndex, cageIndex.toString());
        request.set("mode", "USE");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = GoldenCage.parsePage(response.html);
        response.touch();
        logger.debug("Golden cage page loaded.", response.durationInMillis);
        return page;
    }

    async takeOut(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "GETOUTLONGZI");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async putInto(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "PUTINLONGZI");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    static parsePage(pageHtml: string) {
        const petList: Pet[] = [];
        $(pageHtml)
            .find("input:radio")
            .each(function (_idx, radio) {
                const c0 = $(radio).parent();
                const c1 = $(c0).next();
                const c2 = $(c1).next();
                const c3 = $(c2).next();
                const c4 = $(c3).next();
                const c5 = $(c4).next();
                const c6 = $(c5).next();
                const c7 = $(c6).next();
                const c8 = $(c7).next();
                const c9 = $(c8).next();
                const c10 = $(c9).next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.name = $(c1).text();
                pet.level = parseInt($(c2).text());
                let s = $(c3).text();
                pet.health = parseInt(StringUtils.substringBeforeSlash(s));
                pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
                pet.attack = parseInt($(c4).text());
                pet.defense = parseInt($(c5).text());
                pet.specialAttack = parseInt($(c6).text());
                pet.specialDefense = parseInt($(c7).text());
                pet.speed = parseInt($(c8).text());
                pet.experience = parseInt($(c9).text());
                pet.gender = $(c10).text();
                petList.push(pet);
            });
        const page = new GoldenCagePage();
        page.petList = petList;
        return page;
    }
}

export = GoldenCage;