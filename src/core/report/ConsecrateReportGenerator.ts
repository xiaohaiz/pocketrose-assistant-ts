import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import EquipmentConsecrateLog from "../equipment/EquipmentConsecrateLog";
import EquipmentConsecrateLogStorage from "../equipment/EquipmentConsecrateLogStorage";
import TeamMember from "../team/TeamMember";
import TeamMemberLoader from "../team/TeamMemberLoader";

class ConsecrateReportGenerator {

    #includeExternal = true;

    includeExternal(includeExternal: boolean): ConsecrateReportGenerator {
        this.#includeExternal = includeExternal;
        return this;
    }

    async generateReport(): Promise<void> {
        const roleReports = new Map<string, RoleConsecrateReport>();
        TeamMemberLoader.loadTeamMembersAsMap(this.#includeExternal)
            .forEach(it => {
                const report = new RoleConsecrateReport(it);
                roleReports.set(it.id!, report);
            });

        const equipmentReports = new Map<string, EquipmentConsecrateReport>();

        (await EquipmentConsecrateLogStorage.getInstance().loads())
            .filter(it => roleReports.has(it.roleId!))
            .forEach(it => {
                // 基于角色的统计
                const roleId = it.roleId!;
                const roleReport = roleReports.get(roleId)!;
                roleReport.consecrateCount++;

                // 基于装备的统计
                // 修正祭奠的上洞装备的名称
                let equipmentName = it.equipments!;
                if (_.includes(equipmentName, "好人卡")) {
                    equipmentName = "好人卡";
                } else if (_.startsWith(equipmentName, "齐心★")) {
                    equipmentName = StringUtils.substringAfterLast(equipmentName, "齐心★");
                }
                if (!equipmentReports.has(equipmentName)) {
                    equipmentReports.set(equipmentName, new EquipmentConsecrateReport(equipmentName));
                }
                const equipmentReport = equipmentReports.get(equipmentName)!;
                if (equipmentName === "好人卡") {
                    // 好人卡祭奠每次3张
                    equipmentReport.consecrateCount += 3;
                } else {
                    equipmentReport.consecrateCount++;
                }
            });

        let totalRoleConsecrateCount = 0;
        let totalEquipmentConsecrateCount = 0;
        roleReports.forEach(it => totalRoleConsecrateCount += it.consecrateCount);
        equipmentReports.forEach(it => totalEquipmentConsecrateCount += it.consecrateCount);

        let html = "";
        html += "<table style='text-align:center;background-color:transparent;margin:auto;width:100%;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        // --------------------------------------------------------------------
        // 角色祭奠的表格
        html += "<table style='text-align:center;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellow' colspan='3'>团 队 祭 奠 统 计</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0;color:red;font-weight:bold' colspan='3'>";
        html += "全团队成员总共祭奠" + totalRoleConsecrateCount + "次。";
        html += "</td>";
        html += "</tr>";
        let index = 0;
        roleReports.forEach(report => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white;white-space:nowrap'>";
            html += report.member.name;
            html += "</th>";
            html += "<td style='background-color:#E8E8D0;white-space:nowrap;text-align:right'>";
            html += report.consecrateCount;
            html += "</td>";
            if (index++ === 0) {
                html += "<td style='background-color:#E8E8D0;width:100%;height:300px' " +
                    "rowspan='" + roleReports.size + "' id='_role_consecrate_canvas'>";
                html += "</td>";
            }
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
        // --------------------------------------------------------------------
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td>";
        // --------------------------------------------------------------------
        // 装备祭奠的表格
        html += "<table style='text-align:center;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellow' colspan='3'>上 洞 祭 奠 统 计</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0;color:red;font-weight:bold' colspan='3'>";
        html += "总共祭奠了上洞装备" + totalEquipmentConsecrateCount + "件。";
        html += "</td>";
        html += "</tr>";
        index = 0;
        equipmentReports.forEach(report => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white;white-space:nowrap'>";
            html += report.equipmentName;
            html += "</th>";
            html += "<td style='background-color:#E8E8D0;white-space:nowrap;text-align:right'>";
            html += report.consecrateCount;
            html += "</td>";
            if (index++ === 0) {
                html += "<td style='background-color:#E8E8D0;width:100%;height:300px' " +
                    "rowspan='" + equipmentReports.size + "' id='_equipment_consecrate_canvas'>";
                html += "</td>";
            }
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
        // --------------------------------------------------------------------
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();

        this.#generateRoleConsecrateChart(roleReports);
        this.#generateEquipmentConsecrateChart(equipmentReports);
    }

    #generateRoleConsecrateChart(roleReports: Map<string, RoleConsecrateReport>) {
        const pieData: {}[] = [];
        roleReports.forEach(it => {
            const name = it.member.name!;
            const value = it.consecrateCount!;
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
                    name: '祭奠次数',
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
        const element = document.getElementById("_role_consecrate_canvas")!;
        const chart = echarts.init(element);
        chart.setOption(option);
    }

    #generateEquipmentConsecrateChart(equipmentReports: Map<string, EquipmentConsecrateReport>) {
        const pieData: {}[] = [];
        equipmentReports.forEach(it => {
            const name = it.equipmentName!;
            const value = it.consecrateCount!;
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
                    name: '祭奠次数',
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
        const element = document.getElementById("_equipment_consecrate_canvas")!;
        const chart = echarts.init(element);
        chart.setOption(option);
    }

    async generate() {
        const memberIds = TeamMemberLoader.loadTeamMembers()
            .filter(it => this.#includeExternal || !it.external)
            .map(it => it.id!);
        const logList = (await EquipmentConsecrateLogStorage.getInstance().loads())
            .filter(it => _.includes(memberIds, it.roleId));
        await this.#doGenerate(logList);
    }

    async #doGenerate(candidates: EquipmentConsecrateLog[]) {
        const roles = new Map<string, RoleReport>();
        const memberIds = TeamMemberLoader.loadTeamMembers()
            .filter(it => this.#includeExternal || !it.external)
            .map(it => it.id!);
        TeamMemberLoader.loadTeamMembers()
            .filter(it => _.includes(memberIds, it.id))
            .forEach(config => {
                roles.set(config.id!, new RoleReport(config.name!));
            });
        candidates.forEach(it => {
            roles.get(it.roleId!)?.logList.push(it);
        });

        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td colspan='4' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>祭 奠 统 计</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>名字</th>"
        html += "<th style='background-color:skyblue'>#</th>"
        html += "<th style='background-color:skyblue'>时间</th>"
        html += "<th style='background-color:skyblue'>祭奠</th>"
        html += "</tr>";

        roles.forEach(it => {
            if (it.logList.length > 0) {
                for (let i = 0; i < it.logList.length; i++) {
                    const log = it.logList[i];

                    const consecrateTime = new Date(log.createTime!).toLocaleString();
                    html += "<tr>";
                    if (i === 0) {
                        html += "<td style='background-color:black;color:white' rowspan='" + (it.logList.length) + "'>" + it.roleName + "</td>";
                    }
                    html += "<td style='background-color:#F8F0E0'>" + (i + 1) + "</td>";
                    html += "<td style='background-color:#F8F0E0'>" + consecrateTime + "</td>";
                    html += "<td style='background-color:#F8F0E0;text-align:left'>" + log.equipments + "</td>";
                    html += "</tr>";
                }
            }
        });

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();
    }
}

class RoleConsecrateReport {

    readonly member: TeamMember;
    consecrateCount = 0;

    constructor(member: TeamMember) {
        this.member = member;
    }
}

class EquipmentConsecrateReport {

    readonly equipmentName: string;
    consecrateCount = 0;

    constructor(equipmentName: string) {
        this.equipmentName = equipmentName;
    }
}

class RoleReport {

    readonly roleName: string;
    logList: EquipmentConsecrateLog[];

    constructor(roleName: string) {
        this.roleName = roleName;
        this.logList = [];
    }
}

export = ConsecrateReportGenerator;