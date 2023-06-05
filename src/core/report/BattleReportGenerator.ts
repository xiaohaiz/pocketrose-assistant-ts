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

        let totalPhotoCount = 0;
        let totalPrimaryPhotoCount = 0;
        let totalJuniorPhotoCount = 0;
        let totalSeniorPhotoCount = 0;

        let totalCatchCount = 0;
        let totalPrimaryCatchCount = 0;
        let totalJuniorCatchCount = 0;
        let totalSeniorCatchCount = 0;

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
            totalPhotoCount += data.obtainPhotoCount;
            totalCatchCount += data.obtainCatchCount;
            role.winCount += data.obtainWinCount;
            role.count += data.obtainTotalCount;
            role.photoCount += data.obtainPhotoCount;
            role.catchCount += data.obtainCatchCount;
            switch (data.obtainBattleField) {
                case "初森":
                    totalPrimaryCount += data.obtainTotalCount;
                    totalPrimaryPhotoCount += data.obtainPhotoCount;
                    totalPrimaryCatchCount += data.obtainCatchCount;
                    role.primaryCount += data.obtainTotalCount;
                    role.primaryPhotoCount += data.obtainPhotoCount;
                    role.primaryCatchCount += data.obtainCatchCount;
                    break;
                case "中塔":
                    totalJuniorCount += data.obtainTotalCount;
                    totalJuniorPhotoCount += data.obtainPhotoCount;
                    totalJuniorCatchCount += data.obtainCatchCount;
                    role.juniorCount += data.obtainTotalCount;
                    role.juniorPhotoCount += data.obtainPhotoCount;
                    role.juniorCatchCount += data.obtainCatchCount;
                    break;
                case "上洞":
                    totalSeniorWinCount += data.obtainWinCount;
                    totalSeniorCount += data.obtainTotalCount;
                    totalSeniorPhotoCount += data.obtainPhotoCount;
                    totalSeniorCatchCount += data.obtainCatchCount;
                    role.seniorWinCount += data.obtainWinCount;
                    role.seniorCount += data.obtainTotalCount;
                    role.seniorPhotoCount += data.obtainPhotoCount;
                    role.seniorCatchCount += data.obtainCatchCount;
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

        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
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
                html += "<td style='background-color:#F8F0E0;color:blue'>" + it.winCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + it.count + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.winCount, it.count) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + it.primaryCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + it.juniorCount + "</td>"
                html += "<td style='background-color:#F8F0E0;color:blue'>" + it.seniorWinCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + it.seniorCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.seniorWinCount, it.seniorCount) + "</td>"
                html += "<td style='background-color:#F8F0E0;color:blue'>" + it.zodiacWinCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + it.zodiacCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.zodiacWinCount, it.zodiacCount) + "</td>"
                html += "</tr>";
            }
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>名字</th>"
        html += "<th style='background-color:green;color:white'>图鉴数</th>"
        html += "<th style='background-color:green;color:white'>图鉴入手率（‱）</th>"
        html += "<th style='background-color:green;color:white'>初森</th>"
        html += "<th style='background-color:green;color:white'>初森入手率（‱）</th>"
        html += "<th style='background-color:green;color:white'>中塔</th>"
        html += "<th style='background-color:green;color:white'>中塔入手率（‱）</th>"
        html += "<th style='background-color:green;color:white'>上洞</th>"
        html += "<th style='background-color:green;color:white'>上洞入手率（‱）</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<th style='background-color:wheat'>" + totalPhotoCount + "</th>"
            html += "<th style='background-color:wheat'>" + ReportUtils.permyriad(totalPhotoCount, totalCount) + "</th>"
            html += "<th style='background-color:wheat'>" + totalPrimaryPhotoCount + "</th>"
            html += "<th style='background-color:wheat'>" + ReportUtils.permyriad(totalPrimaryPhotoCount, totalPrimaryCount) + "</th>"
            html += "<th style='background-color:wheat'>" + totalJuniorPhotoCount + "</th>"
            html += "<th style='background-color:wheat'>" + ReportUtils.permyriad(totalJuniorPhotoCount, totalJuniorCount) + "</th>"
            html += "<th style='background-color:wheat'>" + totalSeniorPhotoCount + "</th>"
            html += "<th style='background-color:wheat'>" + ReportUtils.permyriad(totalSeniorPhotoCount, totalSeniorCount) + "</th>"
            html += "</tr>";
        }

        roles.forEach(it => {
            if (it.count > 0) {
                html += "<tr>";
                html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + it.photoCount + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.photoCount, it.count) + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + it.primaryPhotoCount + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.primaryPhotoCount, it.primaryCount) + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + it.juniorPhotoCount + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.juniorPhotoCount, it.juniorCount) + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + it.seniorPhotoCount + "</th>"
                html += "<th style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.seniorPhotoCount, it.seniorCount) + "</th>"
                html += "</tr>";
            }
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

    photoCount = 0;
    primaryPhotoCount = 0;
    juniorPhotoCount = 0;
    seniorPhotoCount = 0;

    catchCount = 0;
    primaryCatchCount = 0;
    juniorCatchCount = 0;
    seniorCatchCount = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
    }
}

export = BattleReportGenerator;