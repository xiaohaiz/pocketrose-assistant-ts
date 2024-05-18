import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PersonalPetEvolutionPage from "./PersonalPetEvolutionPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("PET");

class PersonalPetEvolution {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalPetEvolutionPage> {
        logger.debug("Loading pet evolution page...");
        const request = this.#credential.asRequest();
        if (this.#townId) request.set("town", this.#townId);
        request.set("mode", "PETBORN");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalPetEvolutionPage.parse(response.html);
        response.touch();
        logger.debug("Pet evolution page loaded.", response.durationInMillis);
        return page;
    }

    async propagate(fatherIndex: number, motherIndex: number) {
        const request = this.#credential.asRequest();
        request.set("selectfarther", fatherIndex.toString());
        request.set("selectmother", motherIndex.toString());
        request.set("mode", "PETBORN2");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async evolve(index: number, evolution: number) {
        const request = this.#credential.asRequest();
        request.set("select", index + "," + evolution);
        request.set("mode", "PETBORN3");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async degrade(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "PETBORN4");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async sacrifice(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "PETBORN5");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async consecrate(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "PETBORN6");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = PersonalPetEvolution;