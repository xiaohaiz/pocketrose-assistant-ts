import _ from "lodash";
import PageUtils from "../../util/PageUtils";
import RoleCareerTransfer from "../role/RoleCareerTransfer";
import RoleStorageManager from "../role/RoleStorageManager";
import TeamMemberLoader from "../team/TeamMemberLoader";

class RoleCareerTransferReportGenerator {

    readonly #target?: string;

    constructor(target?: string) {
        this.#target = target;
    }

    generate() {
        RoleStorageManager.getRoleCareerTransferStorage()
            .loads()
            .then(dataList => {
                const internalIds = TeamMemberLoader.loadInternalIds();
                const candidates = dataList
                    .filter(it => _.includes(internalIds, it.roleId))
                    .filter(it => !this.hasTarget || this.#target === it.roleId);
                this.#generate(candidates);
            });
    }

    get hasTarget() {
        return this.#target && this.#target !== "";
    }

    #generate(candidates: RoleCareerTransfer[]) {
        const roles = new Map<string, RoleReportData>();
        TeamMemberLoader.loadTeamMembers()
            .filter(it => !it.external)
            .forEach(config => {
                if (!this.hasTarget || this.#target === config.id) {
                    roles.set(config.id!, new RoleReportData(config.name!));
                }
            });

        candidates.forEach(it => {
            roles.get(it.roleId!)?.logList.push(it);
        });

        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";
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
    }
}

class RoleReportData {

    readonly roleName: string;
    logList: RoleCareerTransfer[];

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

export = RoleCareerTransferReportGenerator;