import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import Role from "./Role";
import StringUtils from "../util/StringUtils";
import TownLoader from "./TownLoader";

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

    tr = $(table).find("tr:eq(2)");
    td = $(tr).find("td:first");
    s = $(td).find("img:first").attr("src")!;
    role.image = StringUtils.substringAfterLast(s, "/");
    td = $(tr).find("td:eq(2)");
    s = $(td).text();
    role.health = parseInt(StringUtils.substringBeforeSlash(s));
    role.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
    td = $(tr).find("td:eq(4)");
    s = $(td).text();
    role.mana = parseInt(StringUtils.substringBeforeSlash(s));
    role.maxMana = parseInt(StringUtils.substringAfterSlash(s));

    tr = $(table).find("tr:eq(3)");
    td = $(tr).find("td:eq(1)");
    s = $(td).text();
    role.spell = StringUtils.substringBefore(s, "(");

    tr = $(table).find("tr:eq(5)");
    td = $(tr).find("td:eq(1)");
    s = $(td).text();
    role.attack = parseInt(s);
    td = $(tr).find("td:eq(3)");
    s = $(td).text();
    role.defense = parseInt(s);

    tr = $(table).find("tr:eq(6)");
    td = $(tr).find("td:eq(1)");
    s = $(td).text();
    role.specialAttack = parseInt(s);
    td = $(tr).find("td:eq(3)");
    s = $(td).text();
    role.specialDefense = parseInt(s);

    tr = $(table).find("tr:eq(7)");
    td = $(tr).find("td:eq(1)");
    s = $(td).text();
    role.speed = parseInt(s);
    td = $(tr).find("td:eq(3)");
    role.pet = $(td).text();

    tr = $(table).find("tr:eq(9)");
    td = $(tr).find("td:eq(1)");
    role.attribute = $(td).text();
    td = $(tr).find("td:eq(3)");
    s = $(td).text();
    if (s === "野外") {
        role.location = "WILD";
    } else {
        const town = TownLoader.getTownByName(s);
        if (town !== null) {
            role.location = "TOWN";
            role.town = town;
        }
    }

    tr = $(table).find("tr:eq(11)");
    td = $(tr).find("td:eq(1)");
    role.task = $(td).text();

    tr = $(table).find("tr:eq(16)");
    td = $(tr).find("td:eq(2)");
    role.experience = parseInt($(td).text());
    td = $(tr).find("td:eq(4)");
    s = $(td).text();
    role.cash = parseInt(StringUtils.substringBefore(s, " G"));

    tr = $(table).find("tr:eq(21)");
    td = $(tr).find("td:first");
    s = $(td).text();
    role.career = StringUtils.substringAfter(s, "职业：");

    role.masterCareerList = [];
    tr = $(table).find("tr:eq(22)");
    td = $(tr).find("td:first");
    s = $(td).text();
    s = StringUtils.substringAfter(s, "掌握职业：");
    for (const it of s.split("】【")) {
        const career = StringUtils.substringBetween(it, "【", "】");
        role.masterCareerList.push(career);
    }

    role.treasureList = [];
    tr = $(table).find("tr:eq(23)");
    td = $(tr).find("td:first");
    s = $(td).text();
    s = StringUtils.substringAfter(s, "仙人的宝物：");
    for (const it of s.split(" ")) {
        if (it !== "") {
            role.treasureList.push(it);
        }
    }

    return role;
}

export = RoleLoader;