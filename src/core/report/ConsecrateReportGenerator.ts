import _ from "lodash";
import EquipmentConsecrateLog from "../equipment/EquipmentConsecrateLog";
import EquipmentConsecrateLogStorage from "../equipment/EquipmentConsecrateLogStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";
import TeamMember from "../team/TeamMember";
import StringUtils from "../../util/StringUtils";

class ConsecrateReportGenerator {

    #includeExternal = true;

    includeExternal(includeExternal: boolean): ConsecrateReportGenerator {
        this.#includeExternal = includeExternal;
        return this;
    }

    async generateReportHTML(): Promise<void> {
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