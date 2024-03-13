import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import ReportUtils from "../../util/ReportUtils";
import BattleResultStorage from "../battle/BattleResultStorage";
import TreasureLoader from "../equipment/TreasureLoader";
import MonsterProfileLoader from "../monster/MonsterProfileLoader";
import TeamMember from "../team/TeamMember";
import TeamMemberLoader from "../team/TeamMemberLoader";

class TreasureReportGenerator {

    #includeExternal = true;

    includeExternal(includeExternal: boolean): TreasureReportGenerator {
        this.#includeExternal = includeExternal;
        return this;
    }

    async generateReport() {
        const roleReports = new Map<string, RoleTreasureReport>();
        const monsterReports = new Map<string, MonsterTreasureReport>();
        let battleCount = 0;
        let winCount = 0;
        let treasureCount = 0;

        TeamMemberLoader.loadTeamMembersAsMap(this.#includeExternal)
            .forEach(it => {
                const report = new RoleTreasureReport(it);
                roleReports.set(it.id!, report);
            });

        (await BattleResultStorage.getInstance().loads())
            .filter(it => it.obtainBattleField === "上洞")
            .filter(it => it.roleId !== undefined)
            .filter(it => roleReports.has(it.roleId!))
            .forEach(data => {
                battleCount += data.obtainTotalCount;
                winCount += data.obtainWinCount;

                const monster = data.monster!;
                if (!monsterReports.has(monster)) {
                    monsterReports.set(monster, new MonsterTreasureReport());
                }
                const monsterReport = monsterReports.get(monster)!;
                monsterReport.battleCount += data.obtainTotalCount;
                monsterReport.winCount += data.obtainWinCount;

                if (data.treasures) {
                    data.treasures.forEach((count, code) => {
                        if (TreasureLoader.isTreasure(code)) {
                            treasureCount += count;
                            monsterReport.treasureCode = code;
                            monsterReport.treasureCount += count;

                            const roleReport = roleReports.get(data.roleId!)!;
                            roleReport.treasureCount++;
                        }
                    });
                }
            });

        let html = "";
        html += "<table style='background-color:transparent;border-width:0;border-spacing:0;margin:auto'>";
        html += "<tbody>";

        let totalTreasureCount = 0;
        roleReports.forEach(it => totalTreasureCount += it.treasureCount);

        // --------------------------------------------------------------------
        // 团队入手数量统计
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='text-align:center;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellow' colspan='3'>团 队 上 洞 入 手 统 计 （ 含 祭 奠 ）</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0;color:red;font-weight:bold' colspan='3'>";
        html += "全团队成员总共入手上洞" + totalTreasureCount + "件（含祭奠）。";
        html += "</td>";
        html += "</tr>";
        let index = 0;
        roleReports.forEach(report => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white;white-space:nowrap'>";
            html += report.member.name;
            html += "</th>";
            html += "<td style='background-color:#E8E8D0;white-space:nowrap;text-align:right'>";
            html += report.treasureCount;
            html += "</td>";
            if (index++ === 0) {
                html += "<td style='background-color:#E8E8D0;width:100%;height:300px' " +
                    "rowspan='" + roleReports.size + "' id='_role_treasure_canvas'>";
                html += "</td>";
            }
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

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
            const profile = MonsterProfileLoader.load(i);
            if (!profile) continue;
            const name = profile.name!;
            const report = monsterReports.get(name);
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

        this.#generateRoleTreasureChart(roleReports);
    }

    #generateRoleTreasureChart(roleReports: Map<string, RoleTreasureReport>) {
        const pieData: {}[] = [];
        roleReports.forEach(it => {
            const name = it.member.name!;
            const value = it.treasureCount!;
            const data = {name: name, value: value};
            pieData.push(data);
        });

        const option: EChartsOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '入手次数',
                    type: 'pie',
                    radius: '50%',
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        const element = document.getElementById("_role_treasure_canvas")!;
        const chart = echarts.init(element);
        chart.setOption(option);
    }

}

class RoleTreasureReport {

    readonly member: TeamMember;
    treasureCount = 0;

    constructor(member: TeamMember) {
        this.member = member;
    }
}

class MonsterTreasureReport {

    battleCount = 0;
    winCount = 0;
    treasures = new Map<string, number>();
    treasureCode = "";
    treasureCount = 0;

}

export = TreasureReportGenerator;