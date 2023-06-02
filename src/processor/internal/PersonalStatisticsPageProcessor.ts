import _ from "lodash";
import BattleStorageManager from "../../battle/BattleStorageManager";
import FastLoginManager from "../../core/FastLoginManager";
import NpcLoader from "../../core/NpcLoader";
import PetProfileLoader from "../../core/PetProfileLoader";
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
                let totalWinRatio;

                let bc1 = 0;
                let wc1 = 0;
                let lc1 = 0;
                let dc1 = 0;
                let wr1;

                let bc2 = 0;
                let wc2 = 0;
                let lc2 = 0;
                let dc2 = 0;
                let wr2;

                let bc3 = 0;
                let wc3 = 0;
                let lc3 = 0;
                let dc3 = 0;
                let wr3;

                let bc4 = 0;
                let wc4 = 0;
                let lc4 = 0;
                let dc4 = 0;
                let wr4;

                let h1 = 0;
                let h2 = 0;
                let h3 = 0;
                let h4 = 0;

                candidate.forEach(it => {
                    totalBattleCount += it.obtainTotalCount;
                    totalWinCount += it.obtainWinCount;
                    totalLoseCount += it.obtainLoseCount;
                    totalDrawCount += it.obtainDrawCount;

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
                            break;
                        case "中塔":
                            bc2 += it.obtainTotalCount;
                            wc2 += it.obtainWinCount;
                            lc2 += it.obtainLoseCount;
                            dc2 += it.obtainDrawCount;
                            break;
                        case "上洞":
                            bc3 += it.obtainTotalCount;
                            wc3 += it.obtainWinCount;
                            lc3 += it.obtainLoseCount;
                            dc3 += it.obtainDrawCount;
                            break;
                        case "十二宫":
                            bc4 += it.obtainTotalCount;
                            wc4 += it.obtainWinCount;
                            lc4 += it.obtainLoseCount;
                            dc4 += it.obtainDrawCount;
                            break;
                    }
                });

                totalWinRatio = totalBattleCount === 0 ? 0 : totalWinCount / totalBattleCount;
                wr1 = bc1 === 0 ? 0 : wc1 / bc1;
                wr2 = bc2 === 0 ? 0 : wc2 / bc2;
                wr3 = bc3 === 0 ? 0 : wc3 / bc3;
                wr4 = bc4 === 0 ? 0 : wc4 / bc4;

                let html = "";
                html += "<table style='background-color:transparent;border-width:0;border-spacing:0;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td>";
                html += "<table style='background-color:#888888;border-width:1px;border-spacing:1px;text-align:center;width:100%;margin:auto'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<td colspan='7' style='background-color:navy;color:yellow;font-weight:bold;text-align:center'>战 斗 统 计</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:green;color:white'>战场</th>"
                html += "<th style='background-color:green;color:white'>战胜数</th>"
                html += "<th style='background-color:green;color:white'>战败数</th>"
                html += "<th style='background-color:green;color:white'>平手数</th>"
                html += "<th style='background-color:green;color:white'>总战数</th>"
                html += "<th style='background-color:green;color:white'>胜率</th>"
                html += "<th style='background-color:green;color:white'>占比</th>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>-</th>"
                html += "<td style='background-color:#F8F0E0'>" + totalWinCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalLoseCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalDrawCount + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + totalBattleCount + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(totalWinRatio) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>-</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>初森</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc1 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc1 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(wr1) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(bc1 / totalBattleCount) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>中塔</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc2 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc2 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(wr2) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(bc2 / totalBattleCount) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>上洞</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc3 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc3 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(wr3) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(bc3 / totalBattleCount) + "</td>"
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>十二宫</th>"
                html += "<td style='background-color:#F8F0E0'>" + wc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + lc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + dc4 + "</td>"
                html += "<td style='background-color:#F8F0E0'>" + bc4 + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(wr4) + "</td>"
                html += "<td style='background-color:#F8F0E0;text-align:left'>" + PageUtils.generateProgressBarWithPercentage(bc4 / totalBattleCount) + "</td>"
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

export = PersonalStatisticsPageProcessor;