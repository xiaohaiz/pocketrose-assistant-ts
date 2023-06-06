import BattleStorageManager from "../../core/battle/BattleStorageManager";
import FastLoginManager from "../../core/FastLoginManager";
import NpcLoader from "../../core/NpcLoader";
import BattleReportGenerator from "../../core/report/BattleReportGenerator";
import GemReportGenerator from "../../core/report/GemReportGenerator";
import MonsterReportGenerator from "../../core/report/MonsterReportGenerator";
import TreasureReportGenerator from "../../core/report/TreasureReportGenerator";
import ZodiacBattleReportGenerator from "../../core/report/ZodiacBattleReportGenerator";
import ZodiacReportGenerator from "../../core/report/ZodiacReportGenerator";
import RoleStorageManager from "../../core/role/RoleStorageManager";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalStatisticsPageProcessor extends PageProcessorCredentialSupport {

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
        html += "<button role='button' id='s-2'>上洞数据统计</button>";
        html += "<button role='button' id='s-3'>宝石数据统计</button>";
        html += "<button role='button' id='s-4'>十二宫战斗统计</button>";
        html += "</td>";
        html += "<tr>";
        html += "<td style='text-align:center;background-color:#F8F0E0'>";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='report-1'>战斗统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-2'>怪物统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-3'>十二宫统计报告</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
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

        this.doBindReturnButton(credential);

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

        doRoleCareerTransferStatistics();
        doTreasureStatistics();
        doGemStatistics();
        doZodiacBattleStatistics();

        doBindReport1();
        doBindReport2();
        doBindReport3();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>想不想对自己的团队有更深层次的了解？</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要点名？单击我的头像即可。</b>";
    }

    abstract doBindReturnButton(credential: Credential): void;
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

function doTreasureStatistics() {
    $("#s-2").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const candidates = dataList
                    .filter(it => target === "" || it.roleId === target);
                const html = new TreasureReportGenerator(candidates).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doGemStatistics() {
    $("#s-3").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const candidates = dataList
                    .filter(it => target === "" || it.roleId === target);
                const html = new GemReportGenerator(candidates).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doZodiacBattleStatistics() {
    $("#s-4").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const candidates = dataList
                    .filter(it => target === "" || it.roleId === target);
                const html = new ZodiacBattleReportGenerator(candidates).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindReport1() {
    $("#report-1").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const html = new BattleReportGenerator(dataList, target).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindReport2() {
    $("#report-2").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const html = new MonsterReportGenerator(dataList, target).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindReport3() {
    $("#report-3").on("click", () => {
        const target = $("#teamMemberSelect").val()! as string;
        BattleStorageManager.getBattleResultStorage()
            .loads()
            .then(dataList => {
                const html = new ZodiacReportGenerator(dataList, target).generate();
                $("#statistics").html(html).parent().show();
            });
    });
}


export = PersonalStatisticsPageProcessor;