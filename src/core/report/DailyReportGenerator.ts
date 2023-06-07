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
            });

        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<thead>";
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

        return html;
    }
}

class RoleDailyReport {

    readonly roleName: string;
    hourMap: Map<number, BattleLog[]>;

    constructor(roleName: string) {
        this.roleName = roleName;
        this.hourMap = new Map();
    }
}

export = DailyReportGenerator;