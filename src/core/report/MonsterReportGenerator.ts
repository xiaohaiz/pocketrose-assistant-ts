import PetProfile from "../../common/PetProfile";
import StringUtils from "../../util/StringUtils";
import BattleResult from "../battle/BattleResult";
import FastLoginManager from "../FastLoginManager";
import PetProfileLoader from "../PetProfileLoader";
import ReportUtils from "./ReportUtils";

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

        let totalSeniorBattleCount = 0;
        let totalBattleCount_012 = 0;       // 巴大蝴(012)
        let totalBattleCount_136 = 0;       // 火精灵(136)
        let totalBattleCount_224 = 0;       // 石章鱼(224)
        let totalBattleCount_257 = 0;       // 火鸡战士(257)

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
            if (battleField === "上洞") {
                totalSeniorBattleCount += data.obtainTotalCount;
                role.seniorBattleCount += data.obtainTotalCount;
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

            switch (code) {
                case "012":
                    totalBattleCount_012 += data.obtainTotalCount;
                    role.battleCount_012 += data.obtainTotalCount;
                    break;
                case "136":
                    totalBattleCount_136 += data.obtainTotalCount;
                    role.battleCount_136 += data.obtainTotalCount;
                    break;
                case "224":
                    totalBattleCount_224 += data.obtainTotalCount;
                    role.battleCount_224 += data.obtainTotalCount;
                    break;
                case "257":
                    totalBattleCount_257 += data.obtainTotalCount;
                    role.battleCount_257 += data.obtainTotalCount;
                    break;
            }
        }

        let html = "";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 怪 物 统 计
        // --------------------------------------------------------------------
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

        // --------------------------------------------------------------------
        // 四 天 王 统 计
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='13'>怪 物 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>巴大蝴(012)</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>火精灵(136)</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>石章鱼(224)</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>火鸡战士(257)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>"
            html += "<td style='background-color:wheat' rowspan='2'>" + PetProfileLoader.load("012")?.imageHtml + "</td>"
            html += "<td style='background-color:wheat'>战数</td>"
            html += "<td style='background-color:wheat'>占比(%)</td>"
            html += "<td style='background-color:wheat' rowspan='2'>" + PetProfileLoader.load("136")?.imageHtml + "</td>"
            html += "<td style='background-color:wheat'>战数</td>"
            html += "<td style='background-color:wheat'>占比(%)</td>"
            html += "<td style='background-color:wheat' rowspan='2'>" + PetProfileLoader.load("224")?.imageHtml + "</td>"
            html += "<td style='background-color:wheat'>战数</td>"
            html += "<td style='background-color:wheat'>占比(%)</td>"
            html += "<td style='background-color:wheat' rowspan='2'>" + PetProfileLoader.load("257")?.imageHtml + "</td>"
            html += "<td style='background-color:wheat'>战数</td>"
            html += "<td style='background-color:wheat'>占比(%)</td>"
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:wheat'>" + totalBattleCount_012 + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalBattleCount_012, totalSeniorBattleCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalBattleCount_136 + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalBattleCount_136, totalSeniorBattleCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalBattleCount_224 + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalBattleCount_224, totalSeniorBattleCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalBattleCount_257 + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalBattleCount_257, totalSeniorBattleCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white' rowspan='2'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0' rowspan='2'>" + PetProfileLoader.load("012")?.imageHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>战数</td>"
            html += "<td style='background-color:#F8F0E0'>占比(%)</td>"
            html += "<td style='background-color:#F8F0E0' rowspan='2'>" + PetProfileLoader.load("136")?.imageHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>战数</td>"
            html += "<td style='background-color:#F8F0E0'>占比(%)</td>"
            html += "<td style='background-color:#F8F0E0' rowspan='2'>" + PetProfileLoader.load("224")?.imageHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>战数</td>"
            html += "<td style='background-color:#F8F0E0'>占比(%)</td>"
            html += "<td style='background-color:#F8F0E0' rowspan='2'>" + PetProfileLoader.load("257")?.imageHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>战数</td>"
            html += "<td style='background-color:#F8F0E0'>占比(%)</td>"
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0'>" + it.battleCount_012 + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.battleCount_012, it.seniorBattleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.battleCount_136 + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.battleCount_136, it.seniorBattleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.battleCount_224 + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.battleCount_224, it.seniorBattleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.battleCount_257 + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.battleCount_257, it.seniorBattleCount) + "</td>"
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

    seniorBattleCount = 0;
    battleCount_012 = 0;       // 巴大蝴(012)
    battleCount_136 = 0;       // 火精灵(136)
    battleCount_224 = 0;       // 石章鱼(224)
    battleCount_257 = 0;       // 火鸡战士(257)

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