import Castle from "../common/Castle";
import Role from "../common/Role";
import TownLoader from "../core/TownLoader";
import Coordinate from "../util/Coordinate";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import PersonalStatusPage from "./PersonalStatusPage";

class PersonalStatus {

    readonly #credential: Credential;
    readonly #townId?: string

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(pageHtml: string): PersonalStatusPage {
        return doParsePage(pageHtml);
    }

    async open(): Promise<PersonalStatusPage> {
        const action = (credential: Credential) => {
            return new Promise<PersonalStatusPage>(resolve => {
                const request = credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "STATUS_PRINT");
                NetworkUtils.post("mydata.cgi", request)
                    .then(pageHtml => {
                        const page = PersonalStatus.parsePage(pageHtml);
                        resolve(page);
                    });
            });
        };
        return await action(this.#credential);
    }

    async load(): Promise<Role> {
        const action = () => {
            return new Promise<Role>(resolve => {
                this.open().then(page => {
                    resolve(page.role!);
                });
            });
        };
        return await action();
    }
}

function doParsePage(pageHtml: string): PersonalStatusPage {
    const role = new Role();
    const table = $(pageHtml).find("table:eq(1)");

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
    } else if (s.includes("(") && s.includes(")")) {
        role.location = "CASTLE";
        const castle = new Castle();
        castle.name = StringUtils.substringBefore(s, " (");
        castle.owner = role.name;
        s = StringUtils.substringBetween(s, "(", ")");
        const x = parseInt(StringUtils.substringBefore(s, ","));
        const y = parseInt(StringUtils.substringAfter(s, ","));
        castle.coordinate = new Coordinate(x, y);
        role.castle = castle;
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

    role.hasMirror = pageHtml.includes("所有其他分身");

    const page = new PersonalStatusPage();
    page.role = role;
    return page;
}

export = PersonalStatus;