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
            return new Promise<Role>((resolve, reject) => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "STATUS_PRINT";
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html: string) {
                    // 有点难办了，在野外无法查询个人状态
                    if (html.includes("非法访问")) {
                        // 先临时试试这样解决
                        reject();
                    } else {
                        const role = RoleParser.parseRole(html);
                        resolve(role);
                    }
                });
            });
        };
        return await action(this.#credential);
    }

}

export = RoleLoader;