import _ from "lodash";
import BattleResult from "../battle/BattleResult";
import TreasureLoader from "../equipment/TreasureLoader";
import TeamMemberLoader from "../team/TeamMemberLoader";
import ReportUtils from "./ReportUtils";

class BattleReportGenerator {

    readonly #dataList: BattleResult[];
    readonly #target?: string;

    constructor(dataList: BattleResult[], target?: string) {
        this.#dataList = dataList;
        this.#target = target;
    }

    generate() {
        const internalIds = TeamMemberLoader.loadInternalIds();
        const candidates = this.#dataList
            .filter(it => _.includes(internalIds, it.roleId))
            .filter(it =>
                this.#target === undefined ||
                this.#target === "" ||
                it.roleId === this.#target);

        let totalWinCount = 0;
        let totalCount = 0;
        let totalPrimaryCount = 0;
        let totalJuniorCount = 0;
        let totalSeniorWinCount = 0;
        let totalSeniorCount = 0;
        let totalZodiacWinCount = 0;
        let totalZodiacCount = 0;

        let totalPhotoCount = 0;
        let totalPrimaryPhotoCount = 0;
        let totalJuniorPhotoCount = 0;
        let totalSeniorPhotoCount = 0;

        let totalCatchCount = 0;
        let totalPrimaryCatchCount = 0;
        let totalJuniorCatchCount = 0;
        let totalSeniorCatchCount = 0;

        let totalHintCount = 0;
        let totalPrimaryHintCount = 0;
        let totalJuniorHintCount = 0;
        let totalSeniorHintCount = 0;

        let totalTreasureCount = 0;
        let totalUsefulTreasureCount = 0;
        let totalUselessTreasureCount = 0;
        let totalGoodPersonCardCount = 0;

        const roles = new Map<string, RoleBattle>();
        TeamMemberLoader.loadTeamMembers()
            .filter(it => !it.external)
            .forEach(config => {
                if (this.#target === undefined || this.#target === "") {
                    roles.set(config.id!, new RoleBattle(config.name!));
                } else if (this.#target === config.id) {
                    roles.set(config.id!, new RoleBattle(config.name!));
                }
            });

        for (const data of candidates) {
            const role = roles.get(data.roleId!);
            if (role === undefined) {
                continue;
            }

            totalWinCount += data.obtainWinCount;
            totalCount += data.obtainTotalCount;
            totalPhotoCount += data.obtainPhotoCount;
            totalCatchCount += data.obtainCatchCount;
            role.winCount += data.obtainWinCount;
            role.count += data.obtainTotalCount;
            role.photoCount += data.obtainPhotoCount;
            role.catchCount += data.obtainCatchCount;
            const battleField = data.obtainBattleField;
            switch (battleField) {
                case "初森":
                    totalPrimaryCount += data.obtainTotalCount;
                    totalPrimaryPhotoCount += data.obtainPhotoCount;
                    totalPrimaryCatchCount += data.obtainCatchCount;
                    role.primaryCount += data.obtainTotalCount;
                    role.primaryPhotoCount += data.obtainPhotoCount;
                    role.primaryCatchCount += data.obtainCatchCount;
                    break;
                case "中塔":
                    totalJuniorCount += data.obtainTotalCount;
                    totalJuniorPhotoCount += data.obtainPhotoCount;
                    totalJuniorCatchCount += data.obtainCatchCount;
                    role.juniorCount += data.obtainTotalCount;
                    role.juniorPhotoCount += data.obtainPhotoCount;
                    role.juniorCatchCount += data.obtainCatchCount;
                    break;
                case "上洞":
                    totalSeniorWinCount += data.obtainWinCount;
                    totalSeniorCount += data.obtainTotalCount;
                    totalSeniorPhotoCount += data.obtainPhotoCount;
                    totalSeniorCatchCount += data.obtainCatchCount;
                    role.seniorWinCount += data.obtainWinCount;
                    role.seniorCount += data.obtainTotalCount;
                    role.seniorPhotoCount += data.obtainPhotoCount;
                    role.seniorCatchCount += data.obtainCatchCount;
                    break;
                case "十二宫":
                    totalZodiacWinCount += data.obtainWinCount;
                    totalZodiacCount += data.obtainTotalCount;
                    role.zodiacWinCount += data.obtainWinCount;
                    role.zodiacCount += data.obtainTotalCount;
                    break;
            }
            if (data.treasures !== undefined) {
                data.treasures.forEach((count, code) => {
                    if (TreasureLoader.isTreasure(code)) {
                        totalTreasureCount += count;
                        role.treasureCount += count;

                        if (TreasureLoader.isUselessTreasure(code)) {
                            totalUselessTreasureCount += count;
                            role.uselessTreasureCount += count;
                            if (TreasureLoader.isGoodPersonCard(code)) {
                                totalGoodPersonCardCount += count;
                                role.goodPersonCardCount += count;
                            }
                        } else {
                            totalUsefulTreasureCount += count;
                            role.usefulTreasureCount += count;
                        }
                    }

                    if (TreasureLoader.isHint(code)) {
                        totalHintCount += count;
                        role.hintCount += count;

                        switch (battleField) {
                            case "初森":
                                totalPrimaryHintCount += count;
                                role.primaryHintCount += count;
                                break;
                            case "中塔":
                                totalJuniorHintCount += count;
                                role.juniorHintCount += count;
                                break;
                            case "上洞":
                                totalSeniorHintCount += count;
                                role.seniorHintCount += count;
                                break;
                        }
                    }
                });
            }
        }

        let html = "";

        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='16'>战 数 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' rowspan='2'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>总计</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>初森</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>中塔</th>"
        html += "<th style='background-color:green;color:white' colspan='4'>上洞</th>"
        html += "<th style='background-color:green;color:white' colspan='4'>十二宫</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>胜利</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>胜率(%)</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "<th style='background-color:green;color:white'>胜利</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>胜率(%)</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "<th style='background-color:green;color:white'>胜利</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>胜率(%)</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat;color:blue'>" + totalWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalWinCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalPrimaryCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalJuniorCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat;color:blue'>" + totalSeniorWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalSeniorWinCount, totalSeniorCount) + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalSeniorCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat;color:blue'>" + totalZodiacWinCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalZodiacCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalZodiacWinCount, totalZodiacCount) + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalZodiacCount, totalCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0;color:blue'>" + it.winCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.count + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.winCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.primaryCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.juniorCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0;color:blue'>" + it.seniorWinCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.seniorWinCount, it.seniorCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.seniorCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0;color:blue'>" + it.zodiacWinCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.zodiacCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.zodiacWinCount, it.zodiacCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.zodiacCount, it.count) + "</td>"
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='13'>图 鉴 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' rowspan='2'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>总计</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>初森</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>中塔</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>上洞</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>图鉴</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>图鉴</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>图鉴</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>图鉴</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat'>" + totalPhotoCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalPhotoCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryPhotoCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalPrimaryPhotoCount, totalPrimaryCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorPhotoCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalJuniorPhotoCount, totalJuniorCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorPhotoCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalSeniorPhotoCount, totalSeniorCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0'>" + it.photoCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.count + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.photoCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryPhotoCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.primaryPhotoCount, it.primaryCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorPhotoCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.juniorPhotoCount, it.juniorCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorPhotoCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.seniorPhotoCount, it.seniorCount) + "</td>"
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='13'>宠 物 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' rowspan='2'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>总计</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>初森</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>中塔</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>上洞</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>宠物</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>宠物</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>宠物</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>宠物</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat'>" + totalCatchCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalCatchCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCatchCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalPrimaryCatchCount, totalPrimaryCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCatchCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalJuniorCatchCount, totalJuniorCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCatchCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalSeniorCatchCount, totalSeniorCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0'>" + it.catchCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.count + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.catchCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryCatchCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.primaryCatchCount, it.primaryCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorCatchCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.juniorCatchCount, it.juniorCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorCatchCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.seniorCatchCount, it.seniorCount) + "</td>"
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='13'>藏 宝 图 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' rowspan='2'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>总计</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>初森</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>中塔</th>"
        html += "<th style='background-color:green;color:white' colspan='3'>上洞</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>藏宝图</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>藏宝图</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>藏宝图</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>藏宝图</th>"
        html += "<th style='background-color:green;color:white'>战数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat'>" + totalHintCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalHintCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryHintCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalPrimaryCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalPrimaryHintCount, totalPrimaryCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorHintCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalJuniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalJuniorHintCount, totalJuniorCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorHintCount + "</td>"
            html += "<td style='background-color:wheat'>" + totalSeniorCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalSeniorHintCount, totalSeniorCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0'>" + it.hintCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.count + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.hintCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryHintCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.primaryCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.primaryHintCount, it.primaryCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorHintCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.juniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.juniorHintCount, it.juniorCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorHintCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.seniorCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.seniorHintCount, it.seniorCount) + "</td>"
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:#888888;text-align:center;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:navy;color:greenyellow' colspan='9'>上 洞 入 手 统 计</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white' rowspan='2'>名字</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>总计</th>"
        html += "<th style='background-color:green;color:white' colspan='2'>非玩具</th>"
        html += "<th style='background-color:green;color:white' colspan='4'>玩具</th>"
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:green;color:white'>入手数</th>"
        html += "<th style='background-color:green;color:white'>入手率(‱)</th>"
        html += "<th style='background-color:green;color:white'>数量</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "<th style='background-color:green;color:white'>数量</th>"
        html += "<th style='background-color:green;color:white'>占比(%)</th>"
        html += "<th style='background-color:green;color:white'>好人卡</th>"
        html += "<th style='background-color:green;color:white'>好人卡占比(%)</th>"
        html += "</tr>";

        if (this.#target === undefined || this.#target === "") {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>全团队</th>"
            html += "<td style='background-color:wheat'>" + totalTreasureCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.permyriad(totalTreasureCount, totalCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalUsefulTreasureCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalUsefulTreasureCount, totalTreasureCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalUselessTreasureCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalUselessTreasureCount, totalTreasureCount) + "</td>"
            html += "<td style='background-color:wheat'>" + totalGoodPersonCardCount + "</td>"
            html += "<td style='background-color:wheat'>" + ReportUtils.percentage(totalGoodPersonCardCount, totalTreasureCount) + "</td>"
            html += "</tr>";
        }

        roles.forEach(it => {
            html += "<tr>";
            html += "<th style='background-color:black;color:white'>" + it.roleName + "</th>"
            html += "<td style='background-color:#F8F0E0'>" + it.treasureCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.permyriad(it.treasureCount, it.count) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.usefulTreasureCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.usefulTreasureCount, it.treasureCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.uselessTreasureCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.uselessTreasureCount, it.treasureCount) + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + it.goodPersonCardCount + "</td>"
            html += "<td style='background-color:#F8F0E0'>" + ReportUtils.percentage(it.goodPersonCardCount, it.treasureCount) + "</td>"
            html += "</tr>";
        });

        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        return html;
    }
}

class RoleBattle {

    readonly roleName: string;

    winCount = 0;
    count = 0;
    primaryCount = 0;
    juniorCount = 0;
    seniorWinCount = 0;
    seniorCount = 0;
    zodiacWinCount = 0;
    zodiacCount = 0;

    photoCount = 0;
    primaryPhotoCount = 0;
    juniorPhotoCount = 0;
    seniorPhotoCount = 0;

    catchCount = 0;
    primaryCatchCount = 0;
    juniorCatchCount = 0;
    seniorCatchCount = 0;

    hintCount = 0;
    primaryHintCount = 0;
    juniorHintCount = 0;
    seniorHintCount = 0;

    treasureCount = 0;
    usefulTreasureCount = 0;
    uselessTreasureCount = 0;
    goodPersonCardCount = 0;

    constructor(roleName: string) {
        this.roleName = roleName;
    }
}

export = BattleReportGenerator;