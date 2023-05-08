import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import MessageBoard from "../../util/MessageBoard";

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async depositAll(): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("azukeru", "all");
                request.set("mode", "CASTLEBANK_SELL");
                NetworkUtils.post("castle.cgi", request)
                    .then(() => {
                        MessageBoard.publishMessage("在城堡银行存入全部现金。");
                        resolve();
                    });
            });
        };
        return await action();
    }
}

export = CastleBank;