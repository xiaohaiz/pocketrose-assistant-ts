import TeamMemberLoader from "../team/TeamMemberLoader";
import {RolePetStatusManager} from "../monster/RolePetStatusManager";

class TeamPetReportGenerator {

    private readonly includeExternal: boolean;

    constructor(includeExternal: boolean) {
        this.includeExternal = includeExternal;
    }

    async generateTeamPetDistribution(): Promise<string> {
        const members = TeamMemberLoader.loadTeamMembersAsMap(this.includeExternal);
        const roleIdList: string[] = [];
        for (const roleId of members.keys()) {
            roleIdList.push(roleId);
        }

        const reports = await RolePetStatusManager.loadRolePetStatusReports(roleIdList);

        let totalPersonalPetCount = 0;
        let totalCagePetCount = 0;
        let totalRanchPetCount = 0;

        let html = "";
        html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888'>";
        html += "<tbody id='equipmentStatusList'>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>队员</th>";
        html += "<th style='background-color:skyblue'>随身宠物</th>";
        html += "<th style='background-color:skyblue'>笼子宠物</th>";
        html += "<th style='background-color:skyblue'>牧场宠物</th>";
        html += "</tr>";
        for (const roleId of roleIdList) {
            html += "<tr>";
            const member = members.get(roleId)!;
            const report = reports.get(roleId);
            html += "<th style='background-color:black;color:white'>" + member.name + "</th>";
            if (report !== undefined) {
                const personalPetCount = report.personalPetCount;
                const cagePetCount = report.cagePetCount;
                const ranchPetCount = member.warehouse ? 0 : report.ranchPetCount;

                html += "<td style='background-color:#E8E8D0'>" + personalPetCount + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + cagePetCount + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + ranchPetCount + "</td>";

                totalPersonalPetCount += personalPetCount;
                totalCagePetCount += cagePetCount;
                totalRanchPetCount += ranchPetCount;
            } else {
                html += "<td style='background-color:#E8E8D0'>-</td>";
                html += "<td style='background-color:#E8E8D0'>-</td>";
                html += "<td style='background-color:#E8E8D0'>-</td>";
            }
            html += "</tr>";
        }
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<th style='background-color:wheat'>" + totalPersonalPetCount + "</th>";
        html += "<th style='background-color:wheat'>" + totalCagePetCount + "</th>";
        html += "<th style='background-color:wheat'>" + totalRanchPetCount + "</th>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        return html;
    }

}

export {TeamPetReportGenerator}