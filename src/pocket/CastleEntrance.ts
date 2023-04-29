import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";
import Castle from "./Castle";

class CastleEntrance {

    readonly #credential: Credential;
    readonly #castle: Castle;

    constructor(credential: Credential, castle: Castle) {
        this.#credential = credential;
        this.#castle = castle;
    }

    async enter(): Promise<void> {
        const instance = this;
        const action = (credential: Credential) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "CASTLE_ENTRY";
                NetworkUtils.sendPostRequest("map.cgi", request, function () {
                    MessageBoard.publishMessage("进入了城堡：<span style='color:greenyellow'>" + instance.#castle.name + "</span>");
                    resolve();
                });
            });
        };
        return await action(this.#credential);
    }

}

export = CastleEntrance;