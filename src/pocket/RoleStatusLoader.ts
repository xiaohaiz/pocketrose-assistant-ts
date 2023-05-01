import Credential from "../util/Credential";
import RoleStatus from "./RoleStatus";
import NetworkUtils from "../util/NetworkUtils";

class RoleStatusLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async loadRoleStatus() {
        const action = (credential: Credential) => {
            return new Promise<RoleStatus>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "STATUS";
                NetworkUtils.sendPostRequest("status.cgi", request, function (html) {
                    const status = new RoleStatus();
                    const text = $(html).text();
                    status.canConsecrate = text.includes("可以进行下次祭奠了");
                    resolve(status);
                });
            });
        };
        return await action(this.#credential);
    }
}

export = RoleStatusLoader;