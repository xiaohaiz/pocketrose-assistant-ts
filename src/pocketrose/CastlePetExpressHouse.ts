import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";

class CastlePetExpressHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async search(searchName: string): Promise<string> {
        return await (() => {
            return new Promise<string>((resolve, reject) => {
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
}

export = CastlePetExpressHouse;