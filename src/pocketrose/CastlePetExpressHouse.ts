import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";

class CastlePetExpressHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async search(searchName: string): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                const request = this.#credential.asRequestMap();
                // noinspection JSDeprecatedSymbols
                request.set("serch", escape(searchName.trim()));
                request.set("mode", "CASTLE_SENDPET");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    const selectHtml = $(html).find("select[name='eid']:first").html();
                    resolve(selectHtml);
                });
            });
        })();
    }

    async send(receiver: string, index: number): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (receiver.trim() === "" || index < 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("eid", receiver.trim());
                request.set("mode", "CASTLE_SENDPET2");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    if (html.includes("所持金不足")) {
                        reject();
                    } else {
                        MessageBoard.processResponseMessage(html);
                        resolve();
                    }
                });
            });
        })();
    }
}

export = CastlePetExpressHouse;