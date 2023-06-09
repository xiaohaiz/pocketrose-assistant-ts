import _ from "lodash";
import MonthRange from "../../util/MonthRange";
import BattleLog from "../battle/BattleLog";
import BattleStorageManager from "../battle/BattleStorageManager";
import TreasureLoader from "../equipment/TreasureLoader";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import PetGangLoader from "../monster/PetGangLoader";
import TeamManager from "../team/TeamManager";
import ReportUtils from "./ReportUtils";

class WeeklyReportGenerator {

    readonly #range: MonthRange;
    readonly #target?: string;
    readonly #maxSize: number;

    constructor(range: MonthRange, target?: string) {
        this.#range = range;
        this.#target = target;

        const lastDay = new Date(this.#range.end).getDate();
        this.#maxSize = lastDay === 31 ? 11 : 10;
    }

    get hasTarget() {
        return this.#target && this.#target !== "";
    }

    generate() {
        BattleStorageManager.battleLogStore
            .findByCreateTime(this.#range.start, this.#range.end)
            .then(dataList => {
                const candidates = dataList
                    .filter(it => !this.hasTarget || it.roleId === this.#target);
                this.#doGenerate(candidates);
            });
    }

    #doGenerate(candidates: BattleLog[]) {
        const roles = new Map<string, RoleReport>();
        TeamManager.loadMembers().forEach(config => {
            if (!this.hasTarget) {
                roles.set(config.id!, new RoleReport(config.name!));
            } else if (this.#target === config.id) {
                roles.set(config.id!, new RoleReport(config.name!));
            }
        });

        const allTreasures = new Map<string, number>();
        const allCatches = new Map<string, number>();
        const allPhotos = new Map<string, number>();

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

        let tc = 0;
        let uc = 0;
        let gc = 0;

        let cc0 = 0;
        let cc1 = 0;
        let cc2 = 0;
        let cc3 = 0;

        let pc0 = 0;
        let pc1 = 0;
        let pc2 = 0;
        let pc3 = 0;

        let hc0 = 0;
        let hc1 = 0;
        let hc2 = 0;
        let hc3 = 0;

        let pgc = 0;
        let wgc = 0;
        let lgc = 0;

        const idxMap = new Map<number, BattleLog[]>();
        candidates
            .filter(it => roles.has(it.roleId!))
            .forEach(it => {
                const idx = _.floor((new Date(it.createTime!).getDate() - 1) / 3);
                if (!idxMap.has(idx)) {
                    idxMap.set(idx, []);
                }
                idxMap.get(idx)?.push(it);

                const role = roles.get(it.roleId!)!;
                if (!role.indexMap.has(idx)) {
                    role.indexMap.set(idx, []);
                }
                role.indexMap.get(idx)?.push(it);

                const win = it.result === "战胜";
                const battleField = it.obtainBattleField;
                const hintCount = it.treasures?.get("050") ? it.treasures!.get("050")! : 0;

                const power = it.treasures?.get("051") ? it.treasures!.get("051")! : 0;
                const weight = it.treasures?.get("052") ? it.treasures!.get("052")! : 0;
                const luck = it.treasures?.get("053") ? it.treasures!.get("053")! : 0;

                bc0++;
                role.bc0++;
                if (win) {
                    wc0++;
                    role.wc0++;
                }
                cc0 += it.catch ? it.catch : 0;
                role.cc0 += it.catch ? it.catch : 0;
                pc0 += it.photo ? it.photo : 0;
                role.pc0 += it.photo ? it.photo : 0;
                hc0 += hintCount;
                role.hc0 += hintCount;
                pgc += power;
                role.pgc += power;
                wgc += weight;
                role.wgc += weight;
                lgc += luck;
                role.lgc += luck;
                switch (battleField) {
                    case "初森":
                        bc1++;
                        role.bc1++;
                        if (win) {
                            wc1++;
                            role.wc1++;
                        }
                        cc1 += it.catch ? it.catch : 0;
                        role.cc1 += it.catch ? it.catch : 0;
                        pc1 += it.photo ? it.photo : 0;
                        role.pc1 += it.photo ? it.photo : 0;
                        hc1 += hintCount;
                        role.hc1 += hintCount;
                        break;
                    case "中塔":
                        bc2++;
                        role.bc2++;
                        if (win) {
                            wc2++;
                            role.wc2++;
                        }
                        cc2 += it.catch ? it.catch : 0;
                        role.cc2 += it.catch ? it.catch : 0;
                        pc2 += it.photo ? it.photo : 0;
                        role.pc2 += it.photo ? it.photo : 0;
                        hc2 += hintCount;
                        role.hc2 += hintCount;
                        break;
                    case "上洞":
                        bc3++;
                        role.bc3++;
                        if (win) {
                            wc3++;
                            role.wc3++;
                        }
                        cc3 += it.catch ? it.catch : 0;
                        role.cc3 += it.catch ? it.catch : 0;
                        pc3 += it.photo ? it.photo : 0;
                        role.pc3 += it.photo ? it.photo : 0;
                        hc3 += hintCount;
                        role.hc3 += hintCount;
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

                if (it.treasures) {
                    it.treasures.forEach((count, code) => {
                        if (TreasureLoader.isTreasure(code)) {
                            if (!allTreasures.has(code)) {
                                allTreasures.set(code, 0);
                            }
                            allTreasures.set(code, allTreasures.get(code)! + count);

                            tc++;
                            role.tc++;
                            if (TreasureLoader.isUselessTreasure(code)) {
                                uc++;
                                role.uc++;
                                if (TreasureLoader.isGoodPersonCard(code)) {
                                    gc++;
                                    role.gc++;
                                }
                            }
                        }
                    });
                }

                if (it.catch) {
                    if (!allCatches.has(it.monster!)) {
                        allCatches.set(it.monster!, 0);
                    }
                    allCatches.set(it.monster!, allCatches.get(it.monster!)! + it.catch);
                }
                if (it.photo) {
                    if (!allPhotos.has(it.monster!)) {
                        allPhotos.set(it.monster!, 0);
                    }
                    allPhotos.set(it.monster!, allPhotos.get(it.monster!)! + it.photo);
                }
            });

        let html = "";
        html += "<table style='background-color:transparent;border-width:0;border-spacing:0;margin:auto'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 月 战 数 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='11'>月 战 数 总 览</th>";
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
        // 月 上 洞 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='9'>月 上 洞 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='2'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='2'>非玩具</th>";
        html += "<th style='background-color:skyblue' colspan='4'>玩具</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>数量</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>数量</th>";
        html += "<th style='background-color:skyblue'>占比(%)</th>";
        html += "<th style='background-color:skyblue'>数量</th>";
        html += "<th style='background-color:skyblue'>占比(%)</th>";
        html += "<th style='background-color:skyblue'>好人卡</th>";
        html += "<th style='background-color:skyblue'>好人卡占比(%)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + tc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(tc, bc3) + "</td>";
        html += "<td style='background-color:wheat'>" + (tc - uc) + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(tc - uc, tc) + "</td>";
        html += "<td style='background-color:wheat'>" + uc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(uc, tc) + "</td>";
        html += "<td style='background-color:wheat'>" + gc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(gc, tc) + "</td>";
        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + role.tc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.tc, role.bc3) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + (role.tc - role.uc) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.tc - role.uc, role.tc) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.uc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.uc, role.tc) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.gc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.gc, role.tc) + "</td>";
            html += "</tr>";
        });

        if (allTreasures.size > 0) {
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0' colspan='9'>";
            html += "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>";
            html += "<thead>";
            html += "<tr>";
            html += "<th style='background-color:wheat'>入手上洞</th>";
            html += "<th style='background-color:wheat'>数量</th>";
            html += "<th style='background-color:wheat'>占比(%)</th>";
            html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
            TreasureLoader.allTreasureNames()
                .forEach(tn => {
                    const code = TreasureLoader.getCodeAsString(tn);
                    const count = allTreasures.get(code);
                    if (count) {
                        html += "<tr>";
                        html += "<th style='background-color:#F8F0E0'>" + tn + "</th>";
                        html += "<td style='background-color:#F8F0E0'>" + count + "</td>";
                        html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(count, tc) + "</td>";
                        html += "</tr>";
                    }
                });
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 月 宠 物 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='13'>月 物 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='3'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='3'>初森</th>";
        html += "<th style='background-color:skyblue' colspan='3'>中塔</th>";
        html += "<th style='background-color:skyblue' colspan='3'>上洞</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>宠物</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>宠物</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>宠物</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>宠物</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + cc0 + "</td>";
        html += "<td style='background-color:wheat'>" + (bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(cc0, bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + cc1 + "</td>";
        html += "<td style='background-color:wheat'>" + bc1 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(cc1, bc1) + "</td>";
        html += "<td style='background-color:wheat'>" + cc2 + "</td>";
        html += "<td style='background-color:wheat'>" + bc2 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(cc2, bc2) + "</td>";
        html += "<td style='background-color:wheat'>" + cc3 + "</td>";
        html += "<td style='background-color:wheat'>" + bc3 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(cc3, bc3) + "</td>";

        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + role.cc0 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + (role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.cc0, role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.cc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.cc1, role.bc1) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.cc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.cc2, role.bc2) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.cc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.cc3, role.bc3) + "</td>";
            html += "</tr>";
        });

        if (allCatches.size > 0) {
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0' colspan='13'>";
            html += "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:wheat;text-align:left'>";
            for (const mn of allCatches.keys()) {
                const profile = MonsterProfileDict.findByName(mn);
                if (profile === null) {
                    continue;
                }
                html += profile.imageHtml;
            }
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 月 图 鉴 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='13'>月 图 鉴 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='3'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='3'>初森</th>";
        html += "<th style='background-color:skyblue' colspan='3'>中塔</th>";
        html += "<th style='background-color:skyblue' colspan='3'>上洞</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>图鉴</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>图鉴</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>图鉴</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>图鉴</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + pc0 + "</td>";
        html += "<td style='background-color:wheat'>" + (bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(pc0, bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + pc1 + "</td>";
        html += "<td style='background-color:wheat'>" + bc1 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(pc1, bc1) + "</td>";
        html += "<td style='background-color:wheat'>" + pc2 + "</td>";
        html += "<td style='background-color:wheat'>" + bc2 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(pc2, bc2) + "</td>";
        html += "<td style='background-color:wheat'>" + pc3 + "</td>";
        html += "<td style='background-color:wheat'>" + bc3 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(pc3, bc3) + "</td>";

        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + role.pc0 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + (role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.pc0, role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.pc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.pc1, role.bc1) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.pc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.pc2, role.bc2) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.pc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.pc3, role.bc3) + "</td>";
            html += "</tr>";
        });

        if (allPhotos.size > 0) {
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0' colspan='13'>";
            html += "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:wheat;text-align:left'>";
            for (const mn of allPhotos.keys()) {
                const profile = MonsterProfileDict.findByName(mn);
                if (profile === null) {
                    continue;
                }
                html += profile.imageHtml;
            }
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 月 藏 宝 图 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='13'>月 藏 宝 图 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='3'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='3'>初森</th>";
        html += "<th style='background-color:skyblue' colspan='3'>中塔</th>";
        html += "<th style='background-color:skyblue' colspan='3'>上洞</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>藏宝图</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>藏宝图</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>藏宝图</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "<th style='background-color:skyblue'>藏宝图</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(‱)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + hc0 + "</td>";
        html += "<td style='background-color:wheat'>" + (bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(hc0, bc0 - bc4) + "</td>";
        html += "<td style='background-color:wheat'>" + hc1 + "</td>";
        html += "<td style='background-color:wheat'>" + bc1 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(hc1, bc1) + "</td>";
        html += "<td style='background-color:wheat'>" + hc2 + "</td>";
        html += "<td style='background-color:wheat'>" + bc2 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(hc2, bc2) + "</td>";
        html += "<td style='background-color:wheat'>" + hc3 + "</td>";
        html += "<td style='background-color:wheat'>" + bc3 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(hc3, bc3) + "</td>";

        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + role.hc0 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + (role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.hc0, role.bc0 - role.bc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.hc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc1 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.hc1, role.bc1) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.hc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc2 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.hc2, role.bc2) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.hc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.bc3 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(role.hc3, role.bc3) + "</td>";
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 月 宝 石 入 手 总 览
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='10'>月 宝 石 入 手 总 览</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' rowspan='2'>成员</th>";
        html += "<th style='background-color:skyblue' colspan='3'>总计</th>";
        html += "<th style='background-color:skyblue' colspan='2'>威力宝石</th>";
        html += "<th style='background-color:skyblue' colspan='2'>重量宝石</th>";
        html += "<th style='background-color:skyblue' colspan='2'>幸运宝石</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'>宝石</th>";
        html += "<th style='background-color:skyblue'>战数</th>";
        html += "<th style='background-color:skyblue'>入手率(%)</th>";
        html += "<th style='background-color:skyblue'>宝石</th>";
        html += "<th style='background-color:skyblue'>入手率(%)</th>";
        html += "<th style='background-color:skyblue'>宝石</th>";
        html += "<th style='background-color:skyblue'>入手率(%)</th>";
        html += "<th style='background-color:skyblue'>宝石</th>";
        html += "<th style='background-color:skyblue'>入手率(%)</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:black;color:white'>全团队</th>";
        html += "<td style='background-color:wheat'>" + (pgc + wgc + lgc) + "</td>";
        html += "<td style='background-color:wheat'>" + wc4 + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(pgc + wgc + lgc, wc4) + "</td>";
        html += "<td style='background-color:wheat'>" + pgc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(pgc, wc4) + "</td>";
        html += "<td style='background-color:wheat'>" + wgc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(wgc, wc4) + "</td>";
        html += "<td style='background-color:wheat'>" + lgc + "</td>";
        html += "<td style='background-color:wheat'>" + ReportUtils.percentage(lgc, wc4) + "</td>";

        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            html += "<td style='background-color:#F8F0E0'>" + (role.pgc + role.wgc + role.lgc) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.wc4 + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.pgc + role.wgc + role.lgc, role.wc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.pgc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.pgc, role.wc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.wgc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.wgc, role.wc4) + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + role.lgc + "</td>";
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(role.lgc, role.wc4) + "</td>";
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 月 战 数 分 布
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='" + (this.#maxSize + 1) + "'>月 战 数 分 布</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'></th>";
        for (let i = 0; i < this.#maxSize; i++) {
            html += "<th style='background-color:skyblue'>(" + (i + 1) + ")</th>";
        }
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        let maxBattleCount = 0;
        idxMap.forEach(v => {
            maxBattleCount = _.max([v.length, maxBattleCount])!;
        });

        html += "<tr>";
        html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
            let battleCount = 0;
            if (dataList) {
                battleCount = dataList.length;
            }
            html += "<td style='background-color:#F8F0E0;vertical-align:bottom;height:128px;width:64px'>" + ReportUtils.generateVerticalBar(battleCount, maxBattleCount) + "</td>";
        }
        html += "</tr>";
        html += "<tr>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
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
            for (let idx = 0; idx <= this.#maxSize; idx++) {
                const dataList = role.indexMap.get(idx);
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

        // --------------------------------------------------------------------
        // 遇 见 四 天 王
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='8'>遇 见 四 天 王</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' colspan='" + (this.#maxSize + 1) + "'>";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;width:100%;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        PetGangLoader.getGang1().forEach(it => {
            const profile = MonsterProfileDict.findByName(it)!;
            html += "<td>";
            html += profile.imageHtml;
            html += "</td>";
        });
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'></th>";
        for (let i = 0; i < this.#maxSize; i++) {
            html += "<th style='background-color:skyblue'>(" + (i + 1) + ")</th>";
        }
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        let mr1 = 0;
        idxMap.forEach(logs => {
            const bc = logs
                .filter(it => it.obtainBattleField === "上洞").length;
            const gc = logs
                .filter(it => PetGangLoader.inGang1(it.monster!)).length;
            if (bc !== 0) {
                mr1 = _.max([mr1, gc / bc])!;
            }
        });

        html += "<tr>";
        html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
            let bc = 0;
            let gc = 0;
            if (dataList) {
                bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                gc = dataList.filter(it => PetGangLoader.inGang1(it.monster!)).length;
            }
            const r = bc === 0 ? 0 : gc / bc;
            html += "<td style='background-color:#F8F0E0;vertical-align:bottom;height:128px;width:64px'>" + ReportUtils.generateVerticalBar(r, mr1) + "</td>";
        }
        html += "</tr>";
        html += "<tr>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
            let bc = 0;
            let gc = 0;
            if (dataList) {
                bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                gc = dataList.filter(it => PetGangLoader.inGang1(it.monster!)).length;
            }
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage2(gc, bc) + "</td>";
        }
        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            for (let idx = 0; idx <= this.#maxSize; idx++) {
                const dataList = role.indexMap.get(idx);
                let bc = 0;
                let gc = 0;
                if (dataList) {
                    bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                    gc = dataList.filter(it => PetGangLoader.inGang1(it.monster!)).length;
                }
                html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage2(gc, bc) + "</td>";
            }
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        // --------------------------------------------------------------------
        // 遇 见 杰 德 天 团
        // --------------------------------------------------------------------
        html += "<tr><td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:yellowgreen' colspan='" + (this.#maxSize + 1) + "'>遇 见 杰 德 天 团</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue' colspan='8'>";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;width:100%;text-align:center;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        PetGangLoader.getGang2().forEach(it => {
            const profile = MonsterProfileDict.findByName(it)!;
            html += "<td>";
            html += profile.imageHtml;
            html += "</td>";
        });
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</th>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:skyblue'></th>";
        for (let i = 0; i < this.#maxSize; i++) {
            html += "<th style='background-color:skyblue'>(" + (i + 1) + ")</th>";
        }
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";

        let mr2 = 0;
        idxMap.forEach(logs => {
            const bc = logs
                .filter(it => it.obtainBattleField === "上洞").length;
            const gc = logs
                .filter(it => PetGangLoader.inGang2(it.monster!)).length;
            if (bc !== 0) {
                mr2 = _.max([mr2, gc / bc])!;
            }
        });

        html += "<tr>";
        html += "<th style='background-color:black;color:white' rowspan='2'>全团队</th>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
            let bc = 0;
            let gc = 0;
            if (dataList) {
                bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                gc = dataList.filter(it => PetGangLoader.inGang2(it.monster!)).length;
            }
            const r = bc === 0 ? 0 : gc / bc;
            html += "<td style='background-color:#F8F0E0;vertical-align:bottom;height:128px;width:64px'>" + ReportUtils.generateVerticalBar(r, mr2) + "</td>";
        }
        html += "</tr>";
        html += "<tr>";
        for (let idx = 0; idx <= this.#maxSize; idx++) {
            const dataList = idxMap.get(idx);
            let bc = 0;
            let gc = 0;
            if (dataList) {
                bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                gc = dataList.filter(it => PetGangLoader.inGang2(it.monster!)).length;
            }
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage2(gc, bc) + "</td>";
        }
        html += "</tr>";

        roles.forEach(role => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + role.roleName + "</th>";
            for (let idx = 0; idx <= this.#maxSize; idx++) {
                const dataList = role.indexMap.get(idx);
                let bc = 0;
                let gc = 0;
                if (dataList) {
                    bc = dataList.filter(it => it.obtainBattleField === "上洞").length;
                    gc = dataList.filter(it => PetGangLoader.inGang2(it.monster!)).length;
                }
                html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage2(gc, bc) + "</td>";
            }
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td></tr>";

        html += "</tbody>";
        html += "</table>";

        $("#statistics").html(html).parent().show();
    }
}

class RoleReport {

    readonly roleName: string;
    indexMap: Map<number, BattleLog[]>;

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

    tc = 0;
    uc = 0;
    gc = 0;

    cc0 = 0;
    cc1 = 0;
    cc2 = 0;
    cc3 = 0;

    pc0 = 0;
    pc1 = 0;
    pc2 = 0;
    pc3 = 0;

    hc0 = 0;
    hc1 = 0;
    hc2 = 0;
    hc3 = 0;

    pgc = 0;
    wgc = 0;
    lgc = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
        this.indexMap = new Map();
    }
}

export = WeeklyReportGenerator;