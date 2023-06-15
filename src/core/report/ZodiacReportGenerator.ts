import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import _ from "lodash";
import Constants from "../../util/Constants";
import ReportUtils from "../../util/ReportUtils";
import BattleResult from "../battle/BattleResult";
import NpcLoader from "../role/NpcLoader";
import TeamMemberLoader from "../team/TeamMemberLoader";

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
        html += "<table style='background-color:transparent;border-width:0;border-spacing:0;margin:auto'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 十 二 宫 战 数 分 布
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow'>十 二 宫 战 数 分 布</th>"
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='zodiacBattleCountDistribution' style='height:320px;background-color:#F8F0E0'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 十 二 宫 胜 率 对 比
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow'>十 二 宫 胜 率 对 比</th>"
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='zodiacWinRatioDistribution' style='height:320px;background-color:#F8F0E0'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 十 二 宫 战 斗 统 计
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
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
        html += "</td></tr>";

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();

        generateBattleCountDistribution(warriors);
        generateWinRatioDistribution(warriors);
    }
}

function generateBattleCountDistribution(reports: Map<string, ZodiacWarrior>) {
    const values: number[] = [];
    NpcLoader.getZodiacNpcNames().forEach(it => {
        const report = reports.get(it)!;
        values.push(report.battleCount);
    })
    const option: EChartsOption = {
        tooltip: {
            show: true
        },
        xAxis: {
            type: 'category',
            data: NpcLoader.getZodiacNpcNames(),
            axisLabel: {
                interval: 0,
                rotate: 40
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: values,
                type: 'bar'
            }
        ]
    };
    const element = document.getElementById("zodiacBattleCountDistribution");
    if (element) {
        const chart = echarts.init(element);
        chart.setOption(option);
    }
}

function generateWinRatioDistribution(reports: Map<string, ZodiacWarrior>) {
    const values: number[] = [];
    NpcLoader.getZodiacNpcNames().forEach(it => {
        const report = reports.get(it)!;
        let r = report.winCount / report.battleCount;
        r *= 100;
        let s = r.toFixed(2);
        values.push(parseFloat(s));
    })

    const formatter = function (value: number) {
        return value + "%";
    };

    const option: EChartsOption = {
        tooltip: {
            show: true
        },
        xAxis: {
            type: 'category',
            data: NpcLoader.getZodiacNpcNames(),
            axisLabel: {
                interval: 0,
                rotate: 40
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value: number) => value + "%"
            }
        },
        series: [
            {
                data: values,
                type: 'bar'
            }
        ]
    };
    const element = document.getElementById("zodiacWinRatioDistribution");
    if (element) {
        const chart = echarts.init(element);
        chart.setOption(option);
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