import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";

class CastleEntrance {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async enter(): Promise<void> {
        const instance = this;
        const action = (credential: Credential) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "CASTLE_ENTRY";
                NetworkUtils.sendPostRequest("map.cgi", request, function () {
                    MessageBoard.publishMessage("进入了城堡。");
                    resolve();
                });
            });
        };
        return await action(this.#credential);
    }

}

export = CastleEntrance;