import _ from "lodash";
import BattleLog from "../battle/BattleLog";
import TeamManager from "../team/TeamManager";
import ReportUtils from "./ReportUtils";

class DailyReportGenerator {

    readonly #logList: BattleLog[];
    readonly #target?: string;


    constructor(logList: BattleLog[], target?: string) {
        this.#logList = logList;
        this.#target = target;
    }

    generate() {
        const candidates = this.#logList
            .filter(it =>
                this.#target === undefined ||
                this.#target === "" ||
                it.roleId === this.#target);

        const roles = new Map<string, RoleDailyReport>();
        TeamManager.loadMembers().forEach(config => {
            if (this.#target === undefined || this.#target === "") {
                roles.set(config.id!, new RoleDailyReport(config.name!));
            } else if (this.#target === config.id) {
                roles.set(config.id!, new RoleDailyReport(config.name!));
            }
        });

        let bc0 = 0;
        let bc1 = 0;
        let bc2 = 0;
        let bc3 = 0;
        let bc4 = 0;

        let wc0 = 0;
        let wc1 = 0;
        let wc2 = 0;
        let wc3 = 0;
        let wc4 = 0;

        const hourMap = new Map<number, BattleLog[]>();
        candidates
            .filter(it => roles.has(it.roleId!))
            .forEach(it => {
                const hour = _.ceil(new Date(it.createTime!).getHours() / 2);
                if (!hourMap.has(hour)) {
                    hourMap.set(hour, []);
                }
                hourMap.get(hour)?.push(it);

                const role = roles.get(it.roleId!)!;
                if (!role.hourMap.has(hour)) {
                    role.hourMap.set(hour, []);
                }
                role.hourMap.get(hour)?.push(it);

                const win = it.result === "战胜";
                bc0++;
                role.bc0++;
                if (win) {
                    wc0++;
                    role.wc0++;
                }
                switch (it.obtainBattleField) {
                    case "初森":
                        bc1++;
                        role.bc1++;
                        if (win) {
                            wc1++;
                            role.wc1++;
                        }
                        break;
                    case "中塔":
                        bc2++;
                        role.bc2++;
                        if (win) {
                            wc2++;
                            role.wc2++;
                        }
                        break;
                    case "上洞":
                        bc3++;
                        role.bc3++;
                        if (win) {
                            wc3++;
                            role.wc3++;
                        }
                        break;
                    case "十二宫":
                        bc4++;
                        role.bc4++;
                        if (win) {
                            wc4++;
                            role.wc4++;
                        }
                        break;
                }
            });

        let html = "";
        html += "<table style='background-color:transparent;border-width:0;border-spacing:0;margin:auto'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 日 战 数 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='11'>日 战 数 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='2'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='2'>初森</th>";
        html += "<th style='background-color:skyblue' colspan='2'>中塔</th>";
        html += "<th style='background-color:skyblue' colspan='2'>上洞</th>";
        html += "<th style='background-color:skyblue' colspan='2'>十二宫</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>胜率(%)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + bc0 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wc0, bc0) + "</td>";
        html += "<td style='background-color:wheat'>" + bc1 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wc1, bc1) + "</td>";
        html += "<td style='background-color:wheat'>" + bc2 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wc2, bc2) + "</td>";
        html += "<td style='background-color:wheat'>" + bc3 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wc3, bc3) + "</td>";
        html += "<td style='background-color:wheat'>" + bc4 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wc4, bc4) + "</td>";
        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc0 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wc0, role.bc0) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wc1, role.bc1) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wc2, role.bc2) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wc3, role.bc3) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc4 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wc4, role.bc4) + "</td>";
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 战 数 分 布
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='13'>日 战 数 分 布</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'></th>";
        html += "<th style='background-color:skyblue'>子时</th>";
        html += "<th style='background-color:skyblue'>丑时</th>";
        html += "<th style='background-color:skyblue'>寅时</th>";
        html += "<th style='background-color:skyblue'>卯时</th>";
        html += "<th style='background-color:skyblue'>辰时</th>";
        html += "<th style='background-color:skyblue'>巳时</th>";
        html += "<th style='background-color:skyblue'>午时</th>";
        html += "<th style='background-color:skyblue'>未时</th>";
        html += "<th style='background-color:skyblue'>申时</th>";
        html += "<th style='background-color:skyblue'>酉时</th>";
        html += "<th style='background-color:skyblue'>戌时</th>";
        html += "<th style='background-color:skyblue'>亥时</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        let maxBattleCount = 0;
        hourMap.forEach((v, k) => {
            maxBattleCount = _.max([v.length, maxBattleCount])!;
        });

        html += "<tr>";
        html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>";
        for (let hour = 0; hour <= 11; hour++) {
            const dataList = hourMap.get(hour);
            let battleCount = 0;
            if (dataList) {
                battleCount = dataList.length;
            }
            html += "<td style='background-color:#F8F0E0;vertical-align:bottom;height:128px;width:64px'>" + ReportUtils.generateVerticalBar(battleCount, maxBattleCount) + "</td>";
        }
        html += "</tr>";
        html += "<tr>";
        for (let hour = 0; hour <= 11; hour++) {
            const dataList = hourMap.get(hour);
            let battleCount = 0;
            if (dataList) {
                battleCount = dataList.length;
            }
            html += "<td style='background-color:#F8F0E0'>" + battleCount + "</td>";
        }
        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            for (let hour = 0; hour <= 11; hour++) {
                const dataList = role.hourMap.get(hour);
                let battleCount = 0;
                if (dataList) {
                    battleCount = dataList.length;
                }
                html += "<td style='background-color:#F8F0E0'>" + battleCount + "</td>";
            }
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class RoleDailyReport {

    readonly roleName: string;
    hourMap: Map<number, BattleLog[]>;

    bc0 = 0;
    bc1 = 0;
    bc2 = 0;
    bc3 = 0;
    bc4 = 0;

    wc0 = 0;
    wc1 = 0;
    wc2 = 0;
    wc3 = 0;
    wc4 = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
        this.hourMap = new Map();
    }
}

export = DailyReportGenerator;