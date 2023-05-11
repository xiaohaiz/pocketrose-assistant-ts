import EquipmentParser from "../pocket/EquipmentParser";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import TreasureBagPage from "./TreasureBagPage";

class TreasureBag {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string) {
        const page = new TreasureBagPage();
        page.equipmentList = EquipmentParser.parseTreasureBagItemList(html);
        return page;
    }

    async open(bagIndex: number): Promise<TreasureBagPage> {
        const action = () => {
            return new Promise<TreasureBagPage>((resolve, reject) => {
                if (bagIndex < 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("chara", "1");
                request.set("item" + bagIndex, bagIndex.toString());
                request.set("mode", "USE");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = TreasureBag.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }
}

export = TreasureBag;