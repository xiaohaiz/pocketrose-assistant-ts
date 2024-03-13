import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import _ from "lodash";
import PageUtils from "../../util/PageUtils";
import CareerChangeLogStorage from "../career/CareerChangeLogStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";

class CareerChangeReportGenerator {

    #includeExternal = true;

    includeExternal(includeExternal: boolean): CareerChangeReportGenerator {
        this.#includeExternal = includeExternal;
        return this;
    }

    async generateReport() {
        const members = TeamMemberLoader.loadTeamMembersAsMap(this.#includeExternal);
        const manaInherit: number[] = [0, 0, 0, 0, 0, 0, 0];
        // MANA 0.4 继承在一天之内小时的分布
        const badManaInheritHourDistribution = new Map<number, number>();

        (await CareerChangeLogStorage.getInstance().loads())
            .filter(it => it.roleId !== undefined)
            .filter(it => members.has(it.roleId!))
            .forEach(it => {
                const mi = parseFloat(PageUtils.convertHtmlToText(it.manaInherit));
                if (mi < 0.45) {
                    manaInherit[0]++;
                    const hour = _.floor(new Date(it.createTime!).getHours() / 2);
                    if (!badManaInheritHourDistribution.has(hour)) {
                        badManaInheritHourDistribution.set(hour, 0);
                    }
                    badManaInheritHourDistribution.set(hour, badManaInheritHourDistribution.get(hour)! + 1);
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
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th colspan='19' style='background-color:navy;color:greenyellow'>Ｍ Ｐ 继 承 分 布</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='19' id='manaInheritDistribution' style='height:320px;background-color:#F8F0E0'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='19' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>ＭＰ 0.4 继承时间分布</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='19' id='badManaInheritHourDistribution' style='height:320px;background-color:#F8F0E0'></td>"
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();

        this.#generateManaInheritDistributionChart(manaInherit);
        this.#generateBadManaInheritHourDistributionChart(badManaInheritHourDistribution);
    }

    #generateManaInheritDistributionChart(manaInherit: number[]) {
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

    #generateBadManaInheritHourDistributionChart(badManaInheritHourDistribution: Map<number, number>) {
        const titles = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];
        const values: number[] = [];
        for (let i = 0; i < 12; i++) {
            if (!badManaInheritHourDistribution.has(i)) {
                values.push(0);
            } else {
                values.push(badManaInheritHourDistribution.get(i)!);
            }
        }
        const option: EChartsOption = {
            tooltip: {
                show: true
            },
            xAxis: {
                type: 'category',
                data: titles,
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
        const element = document.getElementById("badManaInheritHourDistribution");
        if (element) {
            const chart = echarts.init(element);
            chart.setOption(option);
        }
    }

}

export = CareerChangeReportGenerator;