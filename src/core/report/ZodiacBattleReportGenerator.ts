import BattleResult from "../battle/BattleResult";
import NpcLoader from "../NpcLoader";
import ReportUtils from "./ReportUtils";

class ZodiacBattleReportGenerator {

    readonly #dataList: BattleResult[];

    constructor(dataList: BattleResult[]) {
        this.#dataList = dataList;
    }

    generate() {
        const warriors = new Map<string, ZodiacWarrior>();
        NpcLoader.getZodiacNpcNames().forEach(it => {
            warriors.set(it, new ZodiacWarrior());
        });

        let totalBattleCount = 0;
        let totalWinCount = 0;
        let totalGemCount = 0;
        let totalPowerGemCount = 0;
        let totalWeightGemCount = 0;
        let totalLuckGemCount = 0;

        this.#dataList
            .filter(data => data.obtainBattleField === "十二宫")
            .forEach(data => {
                totalBattleCount += data.obtainTotalCount;
                totalWinCount += data.obtainWinCount;

                const warrior = warriors.get(data.monster!)!;
                warrior.battleCount += data.obtainTotalCount;
                warrior.winCount += data.obtainWinCount;

                if (data.treasures !== undefined) {
                    const pgc = data.treasures.get("051");
                    const wgc = data.treasures.get("052");
                    const lgc = data.treasures.get("053");

                    if (pgc !== undefined) {
                        totalGemCount += pgc;
                        totalPowerGemCount += pgc;
                        warrior.powerGemCount += pgc;
                    }
                    if (wgc !== undefined) {
                        totalGemCount += wgc;
                        totalWeightGemCount += wgc;
                        warrior.weightGemCount += wgc;
                    }
                    if (lgc !== undefined) {
                        totalGemCount += lgc;
                        totalLuckGemCount += lgc;
                        warrior.luckGemCount += lgc;
                    }
                }
            });

        let html = "";
        html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>圣斗士</th>"
        html += "<th style='background-color:green;color:white'>战胜数</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>胜率</th>"
        html += "<th style='background-color:green;color:white'>战数占比</th>"
        html += "<th style='background-color:green;color:white'>威力</th>"
        html += "<th style='background-color:green;color:white'>重量</th>"
        html += "<th style='background-color:green;color:white'>幸运</th>"
        html += "<th style='background-color:green;color:white'>出率</th>"
        html += "<th style='background-color:green;color:white'>宝石占比</th>"
        html += "</tr>";

        warriors.forEach((warrior, name) => {
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0'>" + name + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.winCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.battleCount + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + warrior.winRatioHtml + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(warrior.battleCount, totalBattleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.powerGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.weightGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.luckGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + warrior.gemRatioHtml + "</td>"
            html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(warrior.gemCount, totalGemCount) + "</td>"
            html += "</tr>";
        });

        html += "<tr>";
        html += "<td style='background-color:wheat;font-weight:bold'>汇总</td>"
        html += "<td style='background-color:wheat'>" + totalWinCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalBattleCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePercentageHtml(totalWinCount, totalBattleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>-</td>"
        html += "<td style='background-color:wheat'>" + totalPowerGemCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalWeightGemCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalLuckGemCount + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>" + ReportUtils.generatePercentageHtml(totalPowerGemCount + totalWeightGemCount + totalLuckGemCount, totalBattleCount) + "</td>"
        html += "<td style='background-color:wheat;text-align:left'>-</td>"
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class ZodiacWarrior {

    battleCount = 0;
    winCount = 0;
    powerGemCount = 0;
    weightGemCount = 0;
    luckGemCount = 0;

    get winRatioHtml() {
        return ReportUtils.generatePercentageHtml(this.winCount, this.battleCount);
    }

    get gemCount() {
        return this.powerGemCount + this.weightGemCount + this.luckGemCount;
    }

    get gemRatioHtml() {
        return ReportUtils.generatePercentageHtml(this.gemCount, this.battleCount);
    }

}

export = ZodiacBattleReportGenerator;