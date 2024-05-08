import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import Castle from "../castle/Castle";
import TownLoader from "../town/TownLoader";
import Role from "./Role";
import {RoleStatusManager} from "./RoleStatus";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import _ from "lodash";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("STATUS");

class PersonalStatus {

    private readonly credential: Credential;
    private readonly townId?: string
    private readonly statusManager: RoleStatusManager;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
        this.statusManager = new RoleStatusManager(credential);
    }

    async open(): Promise<PersonalStatusPage> {
        const request = this.credential.asRequestMap();
        if (this.townId !== undefined) {
            request.set("town", this.townId);
        }
        request.set("mode", "STATUS_PRINT");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalStatusPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Role status page loaded.", response.durationInMillis);
        // Write role status after role parsed.
        await this.statusManager.writeRoleStatus(page.role);
        logger.debug("Role status cache updated.");
        return page;
    }

    async load(): Promise<Role> {
        const page = await this.open();
        return page.role!;
    }
}

class PersonalStatusPage {

    role?: Role;

}

class PersonalStatusPageParser {

    static parsePage(pageHtml: string): PersonalStatusPage {
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
        } else if (s === "地铁区域") {
            role.location = "METRO";
        } else if (s === "唐朝") {
            role.location = "TANG";
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
            const town = TownLoader.load(s);
            if (town) {
                role.location = "TOWN";
                role.town = town;
            }
        }

        tr = $(table).find("tr:eq(10)");
        td = $(tr).find("td:eq(3)");
        s = $(td).text();
        role.additionalLuck = parseInt(s);

        tr = $(table).find("tr:eq(11)");
        td = $(tr).find("td:eq(1)");
        role.task = $(td).text();

        tr = $(table).find("tr:eq(14)");
        td = $(tr).find("td:eq(1)");
        role.consecrateRP = parseInt($(td).text());
        td = $(tr).find("td:eq(3)");
        role.additionalRP = parseInt($(td).text());

        tr = $(table).find("tr:eq(15)");
        td = $(tr).find("td:eq(1)");
        role.mirrorIndex = parseInt($(td).text());
        td = $(tr).find("td:eq(3)");
        role.mirrorCount = parseInt($(td).text());

        tr = $(table).find("tr:eq(16)");
        td = $(tr).find("td:first");
        s = $(td).text();
        role.battleCount = parseInt(StringUtils.substringBefore(s, " 战"));
        role.battleWinCount = parseInt(StringUtils.substringBetween(s, "战 ", " 胜"));

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

        role.hasMirror = role.mirrorCount! > 0;

        // Parse current pet
        if (role.pet !== undefined && role.pet !== "无宠物") {
            const petTable = $(pageHtml)
                .find("td:contains('宠物名 ：')")
                .filter((_idx, td) => {
                    return _.startsWith($(td).text(), "宠物名 ：");
                })
                .closest("table");

            let t = petTable.find("> tbody:first > tr:first > td:first").text();
            t = StringUtils.substringAfterLast(t, "(");
            role.petGender = StringUtils.substringBefore(t, ")");

            const s = petTable.find("> tbody:first > tr:eq(1) > td:first").text();
            role.petLevel = _.parseInt(StringUtils.substringAfter(s, "Ｌｖ"));
        }

        const page = new PersonalStatusPage();
        page.role = role;
        return page;
    }

}

export {PersonalStatus, PersonalStatusPage, PersonalStatusPageParser};