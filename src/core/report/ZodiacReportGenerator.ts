import _ from "lodash";
import Constants from "../../util/Constants";
import BattleResult from "../battle/BattleResult";
import NpcLoader from "../role/NpcLoader";
import TeamMemberLoader from "../team/TeamMemberLoader";
import ReportUtils from "./ReportUtils";

class ZodiacReportGenerator {

    readonly #dataList: BattleResult[];
    readonly #target?: string;

    constructor(dataList: BattleResult[], target?: string) {
        this.#dataList = dataList;
        this.#target = target;
    }

    generate() {
        const internalIds = TeamMemberLoader.loadInternalIds();
        const candidates = this.#dataList
            .filter(it => _.includes(internalIds, it.roleId))
            .filter(it =>
                this.#target === undefined ||
                this.#target === "" ||
                it.roleId === this.#target);

        let zodiacCode = 0;
        const warriors = new Map<string, ZodiacWarrior>();
        NpcLoader.getZodiacNpcNames().forEach(it => {
            warriors.set(it, new ZodiacWarrior(++zodiacCode));
        });

        let totalBattleCount = 0;
        let totalWinCount = 0;
        let totalGemCount = 0;
        let totalPowerGemCount = 0;
        let totalWeightGemCount = 0;
        let totalLuckGemCount = 0;

        candidates
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
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' colspan='2'>圣斗士</th>"
        html += "<th style='background-color:skyblue'>战胜数</th>"
        html += "<th style='background-color:skyblue'>战数</th>"
        html += "<th style='background-color:skyblue'>胜率</th>"
        html += "<th style='background-color:skyblue'>战数占比</th>"
        html += "<th style='background-color:skyblue'>威力</th>"
        html += "<th style='background-color:skyblue'>重量</th>"
        html += "<th style='background-color:skyblue'>幸运</th>"
        html += "<th style='background-color:skyblue'>出率</th>"
        html += "<th style='background-color:skyblue'>宝石占比</th>"
        html += "</tr>";

        html += "<tr>";
        html += "<th style='background-color:wheat;font-weight:bold' colspan='2'>总计</th>"
        html += "<td style='background-color:wheat'>" + totalWinCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalBattleCount + "</td>"
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalWinCount, totalBattleCount) + "</td>"
        html += "<td style='background-color:wheat'>-</td>"
        html += "<td style='background-color:wheat'>" + totalPowerGemCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalWeightGemCount + "</td>"
        html += "<td style='background-color:wheat'>" + totalLuckGemCount + "</td>"
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalPowerGemCount + totalWeightGemCount + totalLuckGemCount, totalWinCount) + "</td>"
        html += "<td style='background-color:wheat'>-</td>"
        html += "</tr>";

        warriors.forEach((warrior, name) => {
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>" + warrior.imageHtml + "</th>"
            html += "<th style='background-color:#F8F0E0'>" + name + "</th>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.winCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.battleCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.winRatioHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(warrior.battleCount, totalBattleCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.powerGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.weightGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.luckGemCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + warrior.gemRatioHtml + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(warrior.gemCount, totalGemCount) + "</td>"
            html += "</tr>";
        });


        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class ZodiacWarrior {

    readonly code: number;
    battleCount = 0;
    winCount = 0;
    powerGemCount = 0;
    weightGemCount = 0;
    luckGemCount = 0;

    constructor(code: number) {
        this.code = code;
    }

    get imageHtml() {
        return "<img src='" + Constants.POCKET_DOMAIN + "/image/12gong/" + this.code + ".gif' " +
            "alt='' width='40' height='60'>";
    }

    get winRatioHtml() {
        return ReportUtils.percentage(this.winCount, this.battleCount);
    }

    get gemCount() {
        return this.powerGemCount + this.weightGemCount + this.luckGemCount;
    }

    get gemRatioHtml() {
        return ReportUtils.percentage(this.gemCount, this.winCount);
    }

}

export = ZodiacReportGenerator;