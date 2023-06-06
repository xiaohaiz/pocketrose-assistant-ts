import PetProfile from "../../common/PetProfile";
import StringUtils from "../../util/StringUtils";
import BattleResult from "../battle/BattleResult";
import FastLoginManager from "../FastLoginManager";
import PetProfileLoader from "../PetProfileLoader";

class MonsterReportGenerator {

    readonly #dataList: BattleResult[];
    readonly #target?: string;

    constructor(dataList: BattleResult[], target?: string) {
        this.#dataList = dataList;
        this.#target = target;
    }

    generate() {
        const candidates = this.#dataList
            .filter(it =>
                this.#target === undefined ||
                this.#target === "" ||
                it.roleId === this.#target);

        // 记录每个怪物战斗了多少次
        const monsterCount = new Map<string, number>();

        const roles = new Map<string, RoleMonster>();
        FastLoginManager.getAllFastLogins().forEach(config => {
            roles.set(config.id!, new RoleMonster(config.name!));
        });

        for (const data of candidates) {
            const role = roles.get(data.roleId!);
            if (role === undefined) {
                continue;
            }

            const battleField = data.obtainBattleField;
            if (battleField === "十二宫") {
                continue;
            }

            const monsterName = data.monster!;
            if (!monsterName.includes("(") && !monsterName.includes(")")) {
                continue;
            }
            const code = StringUtils.substringBetween(monsterName, "(", ")");
            if (!monsterCount.has(code)) {
                monsterCount.set(code, 0);
            }
            monsterCount.set(code, (monsterCount.get(code)! + data.obtainTotalCount));
            if (!role.monsterCount.has(code)) {
                role.monsterCount.set(code, 0);
            }
            role.monsterCount.set(code, (role.monsterCount.get(code)! + data.obtainTotalCount));
        }

        let html = "";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='16'>怪 物 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' colspan='1'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='10'>怪物</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            const list = asList(monsterCount);
            html += "<tr>";
            html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>"
            for (let i = 0; i < 10; i++) {
                const it = list[i]
                if (it === undefined) {
                    html += "<td style='background-color:wheat;width:64px'></td>"
                } else {
                    // @ts-ignore
                    const profile: PetProfile = it[0];
                    html += "<td style='background-color:wheat;width:64px'>" + profile.imageHtml + "</td>"
                }
            }
            html += "</tr>";
            html += "<tr>";
            for (let i = 0; i < 10; i++) {
                const it = list[i]
                if (it === undefined) {
                    html += "<td style='background-color:wheat;width:64px'></td>"
                } else {
                    // @ts-ignore
                    html += "<td style='background-color:wheat;width:64px'>" + it[1] + "</td>"
                }
            }
            html += "</tr>";
        }

        roles.forEach(it => {
            const list = asList(it.monsterCount);
            html += "<tr>";
            html += "<th style='background-color:black;color:white' rowspan='2'>" + it.roleName + "</th>"
            for (let i = 0; i < 10; i++) {
                const it = list[i]
                if (it === undefined) {
                    html += "<td style='background-color:#F8F0E0;width:64px'></td>"
                } else {
                    // @ts-ignore
                    const profile: PetProfile = it[0];
                    html += "<td style='background-color:#F8F0E0;width:64px'>" + profile.imageHtml + "</td>"
                }
            }
            html += "</tr>";
            html += "<tr>";
            for (let i = 0; i < 10; i++) {
                const it = list[i]
                if (it === undefined) {
                    html += "<td style='background-color:#F8F0E0;width:64px'></td>"
                } else {
                    // @ts-ignore
                    html += "<td style='background-color:#F8F0E0;width:64px'>" + it[1] + "</td>"
                }
            }
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class RoleMonster {

    readonly roleName: string;
    readonly monsterCount: Map<string, number>;

    constructor(roleName: string) {
        this.roleName = roleName;
        this.monsterCount = new Map<string, number>();
    }
}

function asList(monsterCount: Map<string, number>) {
    let list: [][] = [];
    monsterCount.forEach((count, code) => {
        const profile = PetProfileLoader.load(code)!;
        // @ts-ignore
        list.push([profile, count]);
    });
    list = list.sort((a, b) => {
        // @ts-ignore
        const ret = b[1] - a[1];
        if (ret !== 0) {
            return ret;
        }
        // @ts-ignore
        return a[0].code.localeCompare(b[0].code);
    });
    return list;
}

export = MonsterReportGenerator;