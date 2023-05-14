import Equipment from "../common/Equipment";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import TreasureBagPage from "./TreasureBagPage";

class TreasureBag {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string) {
        const equipmentList: Equipment[] = [];
        $(html).find("input:checkbox").each(function (_idx, checkbox) {
            const equipment = new Equipment();
            const tr = $(checkbox).parent().parent();

            // index & selectable
            equipment.index = parseInt($(checkbox).val() as string);
            equipment.selectable = true;

            // name & star
            equipment.parseName($(tr).find("td:eq(1)").html());

            // category
            let s = $(tr).find("td:eq(2)").text();
            equipment.category = s;

            // power & weight & endure
            s = $(tr).find("td:eq(3)").text();
            equipment.power = parseInt(s);
            s = $(tr).find("td:eq(4)").text();
            equipment.weight = parseInt(s);
            s = $(tr).find("td:eq(5)").text();
            equipment.endure = parseInt(s);

            // additional
            s = $(tr).find("td:eq(6)").text();
            equipment.additionalPower = parseInt(s);
            s = $(tr).find("td:eq(7)").text();
            equipment.additionalWeight = parseInt(s);
            s = $(tr).find("td:eq(8)").text();
            equipment.additionalLuck = parseInt(s);

            // experience
            s = $(tr).find("td:eq(9)").text();
            equipment.experience = parseInt(s);

            equipmentList.push(equipment);
        });

        const page = new TreasureBagPage();
        page.equipmentList = equipmentList;
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

    async putInto(indexList: number[]): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("chara", "1");
                request.set("mode", "PUTINBAG");
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }

    async takeOut(indexList: number[]): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("mode", "GETOUTBAG");
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }

    async tryTakeOut(count: number): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (count <= 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("mode", "GETOUTBAG");
                for (let i = 0; i < count; i++) {
                    request.set("item" + i, i.toString());
                }
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }
}

export = TreasureBag;