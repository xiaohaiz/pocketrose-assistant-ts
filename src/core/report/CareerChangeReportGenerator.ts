import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import _ from "lodash";
import PageUtils from "../../util/PageUtils";
import CareerChangeLog from "../career/CareerChangeLog";
import CareerChangeLogStorage from "../career/CareerChangeLogStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";

class CareerChangeReportGenerator {

    #includeExternal = true;

    includeExternal(includeExternal: boolean): CareerChangeReportGenerator {
        this.#includeExternal = includeExternal;
        return this;
    }

    generate() {
        CareerChangeLogStorage.getInstance()
            .loads()
            .then(dataList => {
                const memberIds = TeamMemberLoader.loadTeamMembers()
                    .filter(it => this.#includeExternal || !it.external)
                    .map(it => it.id!);
                const candidates = dataList
                    .filter(it => _.includes(memberIds, it.roleId));
                this.#generate(candidates);
            });
    }

    #generate(candidates: CareerChangeLog[]) {
        const roles = new Map<string, RoleReportData>();
        const memberIds = TeamMemberLoader.loadTeamMembers()
            .filter(it => this.#includeExternal || !it.external)
            .map(it => it.id!);
        TeamMemberLoader.loadTeamMembers()
            .filter(it => _.includes(memberIds, it.id))
            .forEach(config => {
                roles.set(config.id!, new RoleReportData(config.name!));
            });

        const manaInherit: number[] = [0, 0, 0, 0, 0, 0, 0];
        candidates.forEach(it => {
            roles.get(it.roleId!)?.logList.push(it);

            const mi = parseFloat(PageUtils.convertHtmlToText(it.manaInherit));
            if (mi < 0.45) {
                manaInherit[0]++;
            } else if (mi < 0.55) {
                manaInherit[1]++;
            } else if (mi < 0.65) {
                manaInherit[2]++;
            } else if (mi < 0.75) {
                manaInherit[3]++;
            } else if (mi < 0.85) {
                manaInherit[4]++;
            } else if (mi < 0.95) {
                manaInherit[5]++;
            } else {
                manaInherit[6]++;
            }
        });

        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='19' style='background-color:navy;color:greenyellow'>Ｍ Ｐ 继 承 分 布</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='19' id='manaInheritDistribution' style='height:320px;background-color:#F8F0E0'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='19' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>转 职 统 计</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>名字</th>"
        html += "<th style='background-color:green;color:white'>#</th>"
        html += "<th style='background-color:green;color:white'>时间</th>"
        html += "<th style='background-color:green;color:white'>职业</th>"
        html += "<th style='background-color:green;color:white'>等级</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>ＨＰ</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>ＭＰ</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>攻击</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>防御</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>智力</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>精神</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>速度</th>"
        html += "</tr>";

        roles.forEach(data => {
            if (data.logList.length > 0) {
                const logList = data.logList;
                for (let i = 0; i < logList.length; i++) {
                    const log = logList[i];

                    const transferTime = new Date(log.createTime!).toLocaleString();
                    html += "<tr>";
                    if (i === 0) {
                        html += "<td style='background-color:black;color:white' rowspan='" + (logList.length * 2 + 1) + "'>" + data.roleName + "</td>"
                    }
                    html += "<td style='background-color:#F8F0E0' rowspan='2'>" + (i + 1) + "</td>"
                    html += "<td style='background-color:#F8F0E0' rowspan='2'>" + transferTime + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.career_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.level_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.health_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.healthInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.mana_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.manaInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.attack_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.attackInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.defense_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.defenseInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.specialAttack_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.specialAttackInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.specialDefense_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.specialDefenseInherit + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.speed_1 + "</td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + log.speedInherit + "</td>"
                    html += "</tr>";

                    html += "<tr>";
                    html += "<td style='background-color:#F8F0E0'>" + log.career_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.level_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.health_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.mana_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.attack_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.defense_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.specialAttack_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.specialDefense_2 + "</td>"
                    html += "<td style='background-color:#F8F0E0'>" + log.speed_2 + "</td>"
                    html += "</tr>";

                    data.totalHealthInherit += parseFloat(PageUtils.convertHtmlToText(log.healthInherit));
                    data.totalManaInherit += parseFloat(PageUtils.convertHtmlToText(log.manaInherit));
                    data.totalAttackInherit += parseFloat(PageUtils.convertHtmlToText(log.attackInherit));
                    data.totalDefenseInherit += parseFloat(PageUtils.convertHtmlToText(log.defenseInherit));
                    data.totalSpecialAttackInherit += parseFloat(PageUtils.convertHtmlToText(log.specialAttackInherit));
                    data.totalSpecialDefenseInherit += parseFloat(PageUtils.convertHtmlToText(log.specialDefenseInherit));
                    data.totalSpeedInherit += parseFloat(PageUtils.convertHtmlToText(log.speedInherit));
                }

                html += "<tr>";
                html += "<td style='background-color:wheat' colspan='5'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalHealthInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalManaInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalAttackInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalDefenseInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalSpecialAttackInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalSpecialDefenseInherit / logList.length).toFixed(2)) + "</td>"
                html += "<td style='background-color:wheat'></td>"
                html += "<td style='background-color:wheat;font-weight:bold'>" + ((data.totalSpeedInherit / logList.length).toFixed(2)) + "</td>"
                html += "</tr>";
            }
        });

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();

        const pieData: {}[] = [];
        pieData.push({name: "0.4", value: manaInherit[0]});
        pieData.push({name: "0.5", value: manaInherit[1]});
        pieData.push({name: "0.6", value: manaInherit[2]});
        pieData.push({name: "0.7", value: manaInherit[3]});
        pieData.push({name: "0.8", value: manaInherit[4]});
        pieData.push({name: "0.9", value: manaInherit[5]});
        pieData.push({name: "1.0", value: manaInherit[6]});
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
                    name: 'ＭＰ继承分布',
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
        const element = document.getElementById("manaInheritDistribution")!;
        const chart = echarts.init(element);
        chart.setOption(option);
    }
}

class RoleReportData {

    readonly roleName: string;
    logList: CareerChangeLog[];

    totalHealthInherit = 0;
    totalManaInherit = 0;
    totalAttackInherit = 0;
    totalDefenseInherit = 0;
    totalSpecialAttackInherit = 0;
    totalSpecialDefenseInherit = 0;
    totalSpeedInherit = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
        this.logList = [];
    }

}

export = CareerChangeReportGenerator;