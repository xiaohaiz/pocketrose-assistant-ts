import BattleResult from "../battle/BattleResult";
import FastLoginManager from "../FastLoginManager";
import ReportUtils from "./ReportUtils";

class BattleReportGenerator {

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
                it.id === this.#target);

        let totalWinCount = 0;
        let totalCount = 0;
        let totalPrimaryCount = 0;
        let totalJuniorCount = 0;
        let totalSeniorWinCount = 0;
        let totalSeniorCount = 0;
        let totalZodiacWinCount = 0;
        let totalZodiacCount = 0;

        const roles = new Map<string, RoleBattle>();
        FastLoginManager.getAllFastLogins().forEach(config => {
            roles.set(config.id!, new RoleBattle(config.name!));
        });

        for (const data of candidates) {
            const role = roles.get(data.roleId!);
            if (role === undefined) {
                continue;
            }

            totalWinCount += data.obtainWinCount;
            totalCount += data.obtainTotalCount;
            role.winCount += data.obtainWinCount;
            role.count += data.obtainTotalCount;
            switch (data.obtainBattleField) {
                case "初森":
                    totalPrimaryCount += data.obtainTotalCount;
                    role.primaryCount += data.obtainTotalCount;
                    break;
                case "中塔":
                    totalJuniorCount += data.obtainTotalCount;
                    role.juniorCount += data.obtainTotalCount;
                    break;
                case "上洞":
                    totalSeniorWinCount += data.obtainWinCount;
                    totalSeniorCount += data.obtainTotalCount;
                    role.seniorWinCount += data.obtainWinCount;
                    role.seniorCount += data.obtainTotalCount;
                    break;
                case "十二宫":
                    totalZodiacWinCount += data.obtainWinCount;
                    totalZodiacCount += data.obtainTotalCount;
                    role.zodiacWinCount += data.obtainWinCount;
                    role.zodiacCount += data.obtainTotalCount;
                    break;
            }
        }

        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>战数</th>"
        html += "<th style='background-color:green;color:white'>胜率（%）</th>"
        html += "<th style='background-color:green;color:white'>初森</th>"
        html += "<th style='background-color:green;color:white'>中塔</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>上洞</th>"
        html += "<th style='background-color:green;color:white'>上洞胜率（%）</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>十二宫</th>"
        html += "<th style='background-color:green;color:white'>十二宫胜率（%）</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat;color:blue'>" + totalWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalWinCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCount + "</td>"
            html += "<td style='background-color:wheat;color:blue'>" + totalSeniorWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalSeniorWinCount, totalSeniorCount) + "</td>"
            html += "<td style='background-color:wheat;color:blue'>" + totalZodiacWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalZodiacCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalZodiacWinCount, totalZodiacCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            if (it.count > 0) {
                html += "<tr>";
                html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
                html += "<td style='background-color:wheat;color:blue'>" + it.winCount + "</td>"
                html += "<td style='background-color:wheat'>" + it.count + "</td>"
                html += "<td style='background-color:wheat'>" + ReportUtils.percentage(it.winCount, it.count) + "</td>"
                html += "<td style='background-color:wheat'>" + it.primaryCount + "</td>"
                html += "<td style='background-color:wheat'>" + it.juniorCount + "</td>"
                html += "<td style='background-color:wheat;color:blue'>" + it.seniorWinCount + "</td>"
                html += "<td style='background-color:wheat'>" + it.seniorCount + "</td>"
                html += "<td style='background-color:wheat'>" + ReportUtils.percentage(it.seniorWinCount, it.seniorCount) + "</td>"
                html += "<td style='background-color:wheat;color:blue'>" + it.zodiacWinCount + "</td>"
                html += "<td style='background-color:wheat'>" + it.zodiacCount + "</td>"
                html += "<td style='background-color:wheat'>" + ReportUtils.percentage(it.zodiacWinCount, it.zodiacCount) + "</td>"
                html += "</tr>";
            }
        });

        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class RoleBattle {

    readonly roleName: string;
    winCount = 0;
    count = 0;
    primaryCount = 0;
    juniorCount = 0;
    seniorWinCount = 0;
    seniorCount = 0;
    zodiacWinCount = 0;
    zodiacCount = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
    }
}

export = BattleReportGenerator;