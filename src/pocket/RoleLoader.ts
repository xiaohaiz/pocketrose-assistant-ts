import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import Role from "./Role";
import RoleParser from "./RoleParser";

class RoleLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async load() {
        const action = (credential: Credential) => {
            return new Promise<Role>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "STATUS_PRINT";
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html: string) {
                    const role = RoleParser.parseRole(html);
                    resolve(role);
                });
            });
        };
        return await action(this.#credential);
    }

}

export = RoleLoader;