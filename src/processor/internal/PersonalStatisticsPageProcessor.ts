import _ from "lodash";
import BattleStorageManager from "../../core/battle/BattleStorageManager";
import FastLoginManager from "../../core/FastLoginManager";
import NpcLoader from "../../core/NpcLoader";
import PetProfileLoader from "../../core/PetProfileLoader";
import ReportUtils from "../../core/report/ReportUtils";
import RoleStorageManager from "../../core/role/RoleStorageManager";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalStatisticsPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        // 点名的页面也是令人无语，全部在一个大form里面。
        let lastDivHtml = "";
        $("form:first")
            .attr("id", "rollCallForm")
            .find("> center:last")
            .find("> div:last")
            .html((idx, html) => {
                lastDivHtml = html;
                return html;
            })
            .addClass("remove-candidate")
            .prev().hide()
            .prev().hide()
            .prev().hide();

        $(".remove-candidate").remove();

        // 恢复之前的div
        $("#rollCallForm")
            .after($("" +
                "<hr style='height:0;width:100%'>" +
                "<div style='text-align:center'>" + lastDivHtml + "</div>" +
                ""));

        // 在表单前插入统计页面
        let html = "";
        html += "<table style='width:100%;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitle'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardContainer'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-4'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-5'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='operation' style='text-align:center;background-color:#F8F0E0'></td>";
        html += "<tr>";
        html += "<tr>";
        html += "<td style='text-align:center;background-color:#F8F0E0'>";
        html += "<button role='button' id='s-1'>转职数据统计</button>";
        html += "</td>";
        html += "<tr>";
        html += "<tr style='display:none'>";
        html += "<td id='statistics' style='text-align:center;background-color:#F8F0E0'></td>";
        html += "<tr>";
        html += "<td id='menuContainer' style='text-align:center;background-color:#F8F0E0'>";
        html += "<button role='button' id='returnButton'>返回城市</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#rollCallForm")
            .hide()
            .before($(html));

        $("#pageTitle")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  团 队 统 计  ＞＞");

        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());
        $("#messageBoardManager").on("click", () => {
            $("#rollCallForm").toggle();
        });

        $("#returnButton").on("click", () => {
            $("input:submit[value='返回城市']").trigger("click");
        });

        html = "";
        html += "<select id='teamMemberSelect'>";
        html += "<option value=''>全团队</option>";
        const configList = FastLoginManager.getAllFastLogins();
        configList.forEach(config => {
            html += "<option value='" + config.id + "'>" + config.name + "</option>";
        });
        html += "</select>";
        $("#operation").append($(html));

        $("#operation").append($("<input type='text' id='monster' size='5'>"));

        $("#operation").append($("<button role='button' id='b-1'>战斗统计总览</button>"));
        $("#operation").append($("<button role='button' id='b-2'>怪物胜率排行</button>"));

        doBindButton();
        doRoleCareerTransferStatistics();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>想不想对自己的团队有更深层次的了解？</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要点名？单击我的头像即可。</b>";
    }
}

function doBindButton() {
    $("#b-1").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        const monster = _.trim($("#monster").val()! as string);
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(resultList => {
                const candidate = resultList
                    .filter(it => target === "" || it.roleId === target)
                    .filter(it => monster === "" || it.monster!.includes(monster));

                let totalBattleCount = 0;
                let totalWinCount = 0;
                let totalLoseCount = 0;
                let totalDrawCount = 0;
                let totalCatchCount = 0;
                let totalPhotoCount = 0;

                let totalTreasureCount = 0;
                let totalTreasureHintCount = 0;
                let totalGemCount = 0;

                let bc1 = 0;
                let wc1 = 0;
                let lc1 = 0;
                let dc1 = 0;
                let cc1 = 0;
                let pc1 = 0;

                let bc2 = 0;
                let wc2 = 0;
                let lc2 = 0;
                let dc2 = 0;
                let cc2 = 0;
                let pc2 = 0;

                let bc3 = 0;
                let wc3 = 0;
                let lc3 = 0;
                let dc3 = 0;
                let cc3 = 0;
                let pc3 = 0;

                let bc4 = 0;
                let wc4 = 0;
                let lc4 = 0;
                let dc4 = 0;

                let h1 = 0;
                let h2 = 0;
                let h3 = 0;
                let h4 = 0;

                candidate.forEach(it => {
                    totalBattleCount += it.obtainTotalCount;
                    totalWinCount += it.obtainWinCount;
                    totalLoseCount += it.obtainLoseCount;
                    totalDrawCount += it.obtainDrawCount;
                    totalCatchCount += it.obtainCatchCount;
                    totalPhotoCount += it.obtainPhotoCount;
                    totalTreasureCount += it.obtainTreasureCount;
                    totalTreasureHintCount += it.obtainTreasureHintCount;
                    totalGemCount += it.obtainGemCount;

                    switch (it.monster!) {
                        case "巴大蝴(012)":
                            h1 += it.obtainTotalCount;
                            break;
                        case "火精灵(136)":
                            h2 += it.obtainTotalCount;
                            break;
                        case "石章鱼(224)":
                            h3 += it.obtainTotalCount;
                            break;
                        case "火鸡战士(257)":
                            h4 += it.obtainTotalCount;
                            break;
                    }

                    switch (it.obtainBattleField) {
                        case "初森":
                            bc1 += it.obtainTotalCount;
                            wc1 += it.obtainWinCount;
                            lc1 += it.obtainLoseCount;
                            dc1 += it.obtainDrawCount;
                            cc1 += it.obtainCatchCount;
                            pc1 += it.obtainPhotoCount;
                            break;
                        case "中塔":
                            bc2 += it.obtainTotalCount;
                            wc2 += it.obtainWinCount;
                            lc2 += it.obtainLoseCount;
                            dc2 += it.obtainDrawCount;
                            cc2 += it.obtainCatchCount;
                            pc2 += it.obtainPhotoCount;
                            break;
                        case "上洞":
                            bc3 += it.obtainTotalCount;
                            wc3 += it.obtainWinCount;
                            lc3 += it.obtainLoseCount;
                            dc3 += it.obtainDrawCount;
                            cc3 += it.obtainCatchCount;
                            pc3 += it.obtainPhotoCount;
                            break;
                        case "十二宫":
                            bc4 += it.obtainTotalCount;
                            wc4 += it.obtainWinCount;
                            lc4 += it.obtainLoseCount;
                            dc4 += it.obtainDrawCount;
                            break;
                    }
                });

                let html = "";
                html += "<table style='background-color:transparent;border-width:0;border-spacing:0;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td colspan='14' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>战 斗 统 计</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:green;color:white'>战场</th>"
                html += "<th style='background-color:green;color:white'>战胜数</th>"
                html += "<th style='background-color:green;color:white'>战败数</th>"
                html += "<th style='background-color:green;color:white'>平手数</th>"
                html += "<th style='background-color:green;color:white'>总战数</th>"
                html += "<th style='background-color:green;color:white'>胜率</th>"
                html += "<th style='background-color:green;color:white'>占比</th>"
                html += "<th style='background-color:green;color:white'>图鉴数</th>"
                html += "<th style='background-color:green;color:white'>图鉴出率</th>"
                html += "<th style='background-color:green;color:white'>宠物数</th>"
                html += "<th style='background-color:green;color:white'>宠物出率</th>"
                html += "<th style='background-color:green;color:white'>入手数</th>"
                html += "<th style='background-color:green;color:white'>宝图数</th>"
                html += "<th style='background-color:green;color:white'>宝石数</th>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>-</th>"
                html += "<td style='background-color:#F8F0E0'>" + totalWinCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalLoseCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalDrawCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalBattleCount + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(totalWinCount, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>-</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalPhotoCount + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(totalPhotoCount, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalCatchCount + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(totalCatchCount, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalTreasureCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalTreasureHintCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalGemCount + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>初森</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc1 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(wc1, bc1) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermillageHtml(bc1, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + pc1 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(pc1, bc1) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + cc1 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(cc1, bc1) + "</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>中塔</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc2 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(wc2, bc2) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermillageHtml(bc2, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + pc2 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(pc2, bc2) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + cc2 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(cc2, bc2) + "</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>上洞</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(wc3, bc3) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermillageHtml(bc3, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + pc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(pc3, bc3) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + cc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermyriadHtml(cc3, bc3) + "</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>十二宫</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc4 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePercentageHtml(wc4, bc4) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + ReportUtils.generatePermillageHtml(bc4, totalBattleCount) + "</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "<td style='background-color:#F8F0E0'>-</td>"
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                html += "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>";
                html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td colspan='5' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>四 天 王 占 比</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:green;color:white'>天王</th>"
                html += "<th style='background-color:green;color:white'>天王</th>"
                html += "<th style='background-color:green;color:white'>战数</th>"
                html += "<th style='background-color:green;color:white'>上洞战数</th>"
                html += "<th style='background-color:green;color:white'>占比</th>"
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#F8F0E0'>" + PetProfileLoader.load("012")?.imageHtml + "</td>"
                html += "<td style='background-color:#F8F0E0'>巴大蝴(012)</td>"
                html += "<td style='background-color:#F8F0E0'>" + h1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(h1 / bc3) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#F8F0E0'>" + PetProfileLoader.load("136")?.imageHtml + "</td>"
                html += "<td style='background-color:#F8F0E0'>火精灵(136)</td>"
                html += "<td style='background-color:#F8F0E0'>" + h2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(h2 / bc3) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#F8F0E0'>" + PetProfileLoader.load("224")?.imageHtml + "</td>"
                html += "<td style='background-color:#F8F0E0'>石章鱼(224)</td>"
                html += "<td style='background-color:#F8F0E0'>" + h3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(h3 / bc3) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#F8F0E0'>" + PetProfileLoader.load("257")?.imageHtml + "</td>"
                html += "<td style='background-color:#F8F0E0'>火鸡战士(257)</td>"
                html += "<td style='background-color:#F8F0E0'>" + h4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(h4 / bc3) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#F8F0E0;font-weight:bold' colspan='2'>四 天 王</td>"
                html += "<td style='background-color:#F8F0E0'>" + (h1 + h2 + h3 + h4) + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage((h1 + h2 + h3 + h4) / bc3) + "</td>"
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";

                $("#statistics").html(html).parent().show();
            });
    });

    $("#b-2").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;

        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(resultList => {
                const map = {};

                resultList
                    .filter(it => target === "" || it.roleId === target)
                    .filter(it => it.obtainBattleField !== "十二宫")
                    .forEach(it => {
                        const monsterName = it.monster!;
                        // @ts-ignore
                        if (map[monsterName] === undefined) {
                            const m = {};
                            // @ts-ignore
                            m.name = monsterName;
                            // @ts-ignore
                            m.winCount = it.obtainWinCount;
                            // @ts-ignore
                            m.totalCount = it.obtainTotalCount;
                            // @ts-ignore
                            map[monsterName] = m;
                        } else {
                            // @ts-ignore
                            const m: {} = map[monsterName];
                            // @ts-ignore
                            m.winCount = it.obtainWinCount + m.winCount;
                            // @ts-ignore
                            m.totalCount = it.obtainTotalCount + m.totalCount;
                        }
                    });

                // @ts-ignore
                const candidate: {}[] = Object.values(map)
                    .sort((a, b) => {
                        // @ts-ignore
                        const r1 = a.winCount / a.totalCount;
                        // @ts-ignore
                        const r2 = b.winCount / b.totalCount;
                        const ret = r1 - r2;
                        if (ret !== 0) {
                            return ret;
                        }
                        // @ts-ignore
                        return a.name!.localeCompare(b.name!);
                    });

                const max = Math.min(30, candidate.length);

                let html = "";
                html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<th style='background-color:green;color:white'>序号</th>"
                html += "<th style='background-color:green;color:white'>怪物</th>"
                html += "<th style='background-color:green;color:white'>怪物</th>"
                html += "<th style='background-color:green;color:white'>战胜数</th>"
                html += "<th style='background-color:green;color:white'>总战数</th>"
                html += "<th style='background-color:green;color:white'>胜率</th>"
                html += "</tr>";
                for (let i = 0; i < max; i++) {
                    const it = candidate[i];
                    // @ts-ignore
                    const monsterName = it.name!;
                    let monsterImageHtml: string | null = null;
                    if (monsterName.includes("(") && monsterName.includes(")")) {
                        const code = StringUtils.substringBetween(monsterName, "(", ")");
                        const profile = PetProfileLoader.load(code);
                        if (profile !== null) {
                            monsterImageHtml = profile.imageHtml;
                        }
                    }

                    // @ts-ignore
                    const winRatio = it.winCount / it.totalCount;

                    html += "<tr>";
                    html += "<td style='background-color:#F8F0E0;font-weight:bold'>" + (i + 1) + "</>";
                    html += "<td style='background-color:#F8F0E0'>" + ((monsterImageHtml === null) ? "" : monsterImageHtml) + "</td>";
                    html += "<td style='background-color:#F8F0E0;font-weight:bold'>" + monsterName + "</td>";
                    // @ts-ignore
                    html += "<td style='background-color:#F8F0E0;font-weight:bold'>" + it.winCount + "</td>";
                    // @ts-ignore
                    html += "<td style='background-color:#F8F0E0;font-weight:bold'>" + it.totalCount + "</td>";
                    html += "<td style='background-color:#F8F0E0;font-weight:bold;color:red'>" + (winRatio * 100).toFixed(2) + "%</td>";
                    html += "</tr>";
                }

                html += "</tbody>";
                html += "</table>";

                $("#statistics").html(html).parent().show();
            });
    });
}

function doRoleCareerTransferStatistics() {
    $("#s-1").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        if (target === "") {
            alert("请先选择一位队员！");
            return;
        }
        RoleStorageManager.getRoleCareerTransferStorage()
            .findByRoleId(target)
            .then(dataList => {
                const roleName = $("#teamMemberSelect")
                    .find("> option:selected")
                    .text();

                let html = "";
                html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td colspan='18' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>" + roleName + "转职统计</td>";
                html += "</tr>";
                html += "<tr>";
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

                let totalHealthInherit = 0;
                let totalManaInherit = 0;
                let totalAttackInherit = 0;
                let totalDefenseInherit = 0;
                let totalSpecialAttackInherit = 0;
                let totalSpecialDefenseInherit = 0;
                let totalSpeedInherit = 0;

                let count = 0;
                dataList.sort((a, b) => b.createTime! - a.createTime!)
                    .forEach(data => {
                        const transferTime = new Date(data.createTime!).toLocaleString();
                        html += "<tr>";
                        html += "<td style='background-color:#F8F0E0' rowspan='2'>" + (++count) + "</td>"
                        html += "<td style='background-color:#F8F0E0' rowspan='2'>" + transferTime + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.career_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.level_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.health_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.healthInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.mana_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.manaInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.attack_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.attackInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.defense_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.defenseInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.specialAttack_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.specialAttackInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.specialDefense_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.specialDefenseInherit + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.speed_1 + "</td>"
                        html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + data.speedInherit + "</td>"
                        html += "</tr>";

                        html += "<tr>";
                        html += "<td style='background-color:#F8F0E0'>" + data.career_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.level_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.health_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.mana_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.attack_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.defense_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.specialAttack_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.specialDefense_2 + "</td>"
                        html += "<td style='background-color:#F8F0E0'>" + data.speed_2 + "</td>"
                        html += "</tr>";

                        totalHealthInherit += parseFloat(PageUtils.convertHtmlToText(data.healthInherit));
                        totalManaInherit += parseFloat(PageUtils.convertHtmlToText(data.manaInherit));
                        totalAttackInherit += parseFloat(PageUtils.convertHtmlToText(data.attackInherit));
                        totalDefenseInherit += parseFloat(PageUtils.convertHtmlToText(data.defenseInherit));
                        totalSpecialAttackInherit += parseFloat(PageUtils.convertHtmlToText(data.specialAttackInherit));
                        totalSpecialDefenseInherit += parseFloat(PageUtils.convertHtmlToText(data.specialDefenseInherit));
                        totalSpeedInherit += parseFloat(PageUtils.convertHtmlToText(data.speedInherit));
                    });

                if (count > 0) {
                    html += "<tr>";
                    html += "<td style='background-color:#F8F0E0' colspan='5'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalHealthInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalManaInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalAttackInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalDefenseInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalSpecialAttackInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalSpecialDefenseInherit / count).toFixed(2)) + "</td>"
                    html += "<td style='background-color:#F8F0E0'></td>"
                    html += "<td style='background-color:#F8F0E0;font-weight:bold' rowspan='2'>" + ((totalSpeedInherit / count).toFixed(2)) + "</td>"
                    html += "</tr>";
                }

                html += "</tbody>";
                html += "</table>";

                $("#statistics").html(html).parent().show();
            });
    });
}

export = PersonalStatisticsPageProcessor;