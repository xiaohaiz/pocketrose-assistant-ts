import Credential from "../../util/Credential";
import TownWeaponStorePage from "./TownWeaponStorePage";
import PageUtils from "../../util/PageUtils";

class TownWeaponStore {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(pageHtml: string): TownWeaponStorePage {
        const page = new TownWeaponStorePage();

        // Parse credential
        page.credential = PageUtils.parseCredential(pageHtml);

        // Parse townId
        page.townId = $(pageHtml).find("input:hidden[name='townid']").val() as string;

        // Parse discount
        let discount = 1;
        const input = $(pageHtml).find("input:hidden[name='val_off']");
        if (input.length > 0) {
            discount = parseFloat(input.val() as string);
        }
        page.discount = discount;

        return page;
    }

}

export = TownWeaponStore;