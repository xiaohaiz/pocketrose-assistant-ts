import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import TownGemHousePage from "./TownGemHousePage";
import TownGemMeltHouse from "./TownGemMeltHouse";

class TownGemHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static async parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }
}

async function doParsePage(pageHtml: string) {
    const action = (pageHtml: string) => {
        return new Promise<TownGemHousePage>(resolve => {
            const credential = PageUtils.parseCredential(pageHtml);
            const page = new TownGemHousePage(credential);

            new TownGemMeltHouse(credential).enter()
                .then(townGemMeltHousePage => {
                    page.townGemMeltHousePage = townGemMeltHousePage;
                    resolve(page);
                });
        });
    };
    return await action(pageHtml);
}

export = TownGemHouse;