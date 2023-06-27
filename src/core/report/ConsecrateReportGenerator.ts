import _ from "lodash";
import EquipmentConsecrateLog from "../equipment/EquipmentConsecrateLog";
import EquipmentConsecrateLogStorage from "../equipment/EquipmentConsecrateLogStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";

class ConsecrateReportGenerator {

    readonly #target?: string;

    constructor(target: string) {
        this.#target = target;
    }

    get hasTarget() {
        return this.#target && this.#target !== "";
    }

    async generate() {
        const internalIds = TeamMemberLoader.loadInternalIds();
        const logList = (await EquipmentConsecrateLogStorage.getInstance().loads())
            .filter(it => _.includes(internalIds, it.roleId))
            .filter(it => !this.hasTarget || this.#target === it.roleId);
        await this.#doGenerate(logList);
    }

    async #doGenerate(candidates: EquipmentConsecrateLog[]) {
        const roles = new Map<string, RoleReport>();
        TeamMemberLoader.loadTeamMembers()
            .filter(it => !it.external)
            .forEach(config => {
                if (!this.hasTarget || this.#target === config.id) {
                    roles.set(config.id!, new RoleReport(config.name!));
                }
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

class RoleReport {

    readonly roleName: string;
    logList: EquipmentConsecrateLog[];

    constructor(roleName: string) {
        this.roleName = roleName;
        this.logList = [];
    }
}

export = ConsecrateReportGenerator;