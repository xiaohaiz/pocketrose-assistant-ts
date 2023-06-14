import Pet from "../core/monster/Pet";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import NumberUtils from "../util/NumberUtils";
import StringUtils from "../util/StringUtils";
import GoldenCagePage from "./GoldenCagePage";

class GoldenCage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(cageIndex: number): Promise<GoldenCagePage> {
        return await (() => {
            return new Promise<GoldenCagePage>((resolve, reject) => {
                if (!NumberUtils.isIndexNumber(cageIndex)) {
                    reject();
                } else {
                    const request = this.#credential.asRequestMap();
                    request.set("chara", "1");
                    request.set("item" + cageIndex, cageIndex.toString());
                    request.set("mode", "USE");
                    NetworkUtils.post("mydata.cgi", request).then(html => {
                        const page = GoldenCage.parsePage(html);
                        resolve(page);
                    });
                }
            });
        })();
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