import BattleLog from "../battle/BattleLog";
import TeamManager from "../team/TeamManager";

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
                const hour = new Date(it.createTime!).getHours();
                if (!hourMap.has(hour)) {
                    hourMap.set(hour, []);
                }
                hourMap.get(hour)?.push(it);
            });
    }
}

class RoleDailyReport {

    readonly roleName: string;

    constructor(roleName: string) {
        this.roleName = roleName;
    }
}

export = DailyReportGenerator;