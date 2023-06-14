import _ from "lodash";
import BattleResult from "../battle/BattleResult";
import TreasureLoader from "../equipment/TreasureLoader";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import TeamMemberLoader from "../team/TeamMemberLoader";
import ReportUtils from "./ReportUtils";

class TreasureReportGenerator {

    readonly #dataList: BattleResult[];
    readonly #target?: string;

    constructor(dataList: BattleResult[], target: string) {
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
                it.roleId === this.#target)
            .filter(it => it.obtainBattleField === "上洞");

        const reports = new Map<string, Report>();

        let battleCount = 0;
        let winCount = 0;
        let treasureCount = 0;

        candidates.forEach(data => {
            battleCount += data.obtainTotalCount;
            winCount += data.obtainWinCount;

            const monster = data.monster!;
            if (!reports.has(monster)) {
                reports.set(monster, new Report());
            }
            const report = reports.get(monster)!;
            report.battleCount += data.obtainTotalCount;
            report.winCount += data.obtainWinCount;

            if (data.treasures) {
                data.treasures.forEach((count, code) => {
                    if (TreasureLoader.isTreasure(code)) {
                        treasureCount += count;

                        report.treasureCode = code;
                        report.treasureCount += count;
                    }
                });
            }
        });

        let html = "";
        html += "<table style='background-color:transparent;border-width:0;border-spacing:0;margin:auto'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 上 洞 怪 物 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='9'>上 洞 怪 物 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>怪物</th>";
        html += "<th style='background-color:skyblue'>怪物</th>";
        html += "<th style='background-color:skyblue'>战胜</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "<th style='background-color:skyblue'>战数占比(%)</th>";
        html += "<th style='background-color:skyblue'>入手</th>";
        html += "<th style='background-color:skyblue'>入手数量</th>";
        html += "<th style='background-color:skyblue'>入手占比(%)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        for (let i = 1; i <= 493; i++) {
            const profile = MonsterProfileDict.load(i);
            if (!profile) continue;
            const name = profile.name!;
            const report = reports.get(name);
            if (!report) continue;
            const treasureName = TreasureLoader.findTreasureName(report.treasureCode);
            if (!treasureName) continue;

            html += "<tr>";
            html += "<td style='background-color:#F8F0E0;width:64px'>" + profile.imageHtml + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + profile.nameHtml + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + report.winCount + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + report.battleCount + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(report.winCount, report.battleCount) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(report.battleCount, battleCount) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + treasureName + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + report.treasureCount + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(report.treasureCount, treasureCount) + "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();
    }

}

class Report {

    battleCount = 0;
    winCount = 0;
    treasures = new Map<string, number>();
    treasureCode = "";
    treasureCount = 0;

}

export = TreasureReportGenerator;