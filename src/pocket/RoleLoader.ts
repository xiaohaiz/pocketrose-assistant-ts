import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import Role from "./Role";
import StringUtils from "../util/StringUtils";

export = RoleLoader;

class RoleLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async load() {
        const action = (credential: Credential) => {
            return new Promise(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "STATUS_PRINT";
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html: string) {
                    const role = doParseRole(html);
                    resolve(role);
                });
            });
        };
        return await action(this.#credential);
    }

}

function doParseRole(html: string): Role {
    const role = new Role();
    const table = $(html).find("table:eq(1)");

    let s = $(table).find("tr:first td:first").text();
    role.name = StringUtils.substringBetween(s, "姓名 ： ", " (");
    let t = StringUtils.substringBetween(s, "(", ")");
    role.race = StringUtils.substringBefore(t, " ");
    role.gender = StringUtils.substringAfter(t, " ");

    let tr = $(table).find("tr:eq(1)");
    let td = $(tr).find("td:first");
    s = $(td).text();
    role.level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));
    td = $(tr).find("td:eq(1)");
    s = $(td).text();
    role.country = StringUtils.substringBetween(s, "所属：", "(");
    role.unit = StringUtils.substringBetween(s, "(", " 部队)");


    return role;
}