import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TreasureBagPage from "./TreasureBagPage";
import {Equipment} from "./Equipment";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("BAG");

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
        logger.debug("Loading treasure bag page...");
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        request.set("item" + bagIndex, bagIndex.toString());
        request.set("mode", "USE");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = TreasureBag.parsePage(response.html);
        response.touch();
        logger.debug("Treasure bag page loaded.", response.durationInMillis);
        return page;
    }

    async putInto(indexList: number[]): Promise<void> {
        if (indexList.length === 0) return;
        logger.debug("Putting item(s) into treasure bag...");
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        request.set("mode", "PUTINBAG");
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async takeOut(indexList: number[]): Promise<void> {
        if (indexList.length === 0) return;
        logger.debug("Taking item(s) out of treasure bag...");
        const request = this.#credential.asRequest();
        request.set("mode", "GETOUTBAG");
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async tryTakeOut(count: number): Promise<void> {
        if (count <= 0) return;
        logger.debug("Try taking item(s) out of treasure bag... (count=" + count + ")");
        const request = this.#credential.asRequest();
        request.set("mode", "GETOUTBAG");
        for (let i = 0; i < count; i++) {
            request.set("item" + i, i.toString());
        }
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TreasureBag;