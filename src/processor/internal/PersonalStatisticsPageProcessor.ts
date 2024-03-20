import BattleLogService from "../../core/battle/BattleLogService";
import BattleLogStorage from "../../core/battle/BattleLogStorage";
import BattleResultStorage from "../../core/battle/BattleResultStorage";
import CareerChangeLogStorage from "../../core/career/CareerChangeLogStorage";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import EquipmentConsecrateLogStorage from "../../core/equipment/EquipmentConsecrateLogStorage";
import BattleReportGenerator from "../../core/report/BattleReportGenerator";
import CareerChangeReportGenerator from "../../core/report/CareerChangeReportGenerator";
import ConsecrateReportGenerator from "../../core/report/ConsecrateReportGenerator";
import DailyReportGenerator from "../../core/report/DailyReportGenerator";
import MonsterReportGenerator from "../../core/report/MonsterReportGenerator";
import MonthlyReportGenerator from "../../core/report/MonthlyReportGenerator";
import TreasureReportGenerator from "../../core/report/TreasureReportGenerator";
import WeeklyReportGenerator from "../../core/report/WeeklyReportGenerator";
import ZodiacReportGenerator from "../../core/report/ZodiacReportGenerator";
import NpcLoader from "../../core/role/NpcLoader";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import Credential from "../../util/Credential";
import DayRange from "../../util/DayRange";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import MonthRange from "../../util/MonthRange";
import WeekRange from "../../util/WeekRange";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalStatisticsPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
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
        html += "<td id='operation' style='text-align:center;background-color:#F8F0E0'>";
        html += "<input type='checkbox' id='includeExternal'>是否包含编外队员";
        html += "</td>";
        html += "<tr>";
        html += "<td style='text-align:center;background-color:#F8F0E0'>";
        html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='report-1' style='width:100%' class='reportButton'>战斗统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-2' style='width:100%' class='reportButton'>怪物统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-3' style='width:100%' class='reportButton'>十二宫统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-4' style='width:100%' class='reportButton'>转职统计报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-5' style='width:100%' class='reportButton'>上洞入手报告</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='report-6' style='width:100%' class='reportButton'>祭奠统计报告</button>";
        html += "<td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='log-1' style='width:100%' class='reportButton'>当日战报</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='log-2' style='width:100%' class='reportButton'>昨日战报</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='log-3' style='width:100%' class='reportButton'>本周战报</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='log-4' style='width:100%' class='reportButton'>上周战报</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='log-5' style='width:100%' class='reportButton'>本月战报</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='log-6' style='width:100%' class='reportButton'>上月战报</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "<tr>";
        if (TeamMemberLoader.isMaster(credential.id)) {
            html += "<tr>";
            html += "<th style='background-color:red;color:white'>队 长 专 属 数 据 维 护 任 务</th>";
            html += "<tr>";
            html += "<tr>";
            html += "<td style='text-align:center;background-color:#F8F0E0'>";
            html += "<table style='background-color:transparent;border-spacing:0;border-width:0;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='clearBattleLog'>清除战斗记录</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='exportBattleLog'>导出战斗日志</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='importBattleLog'>导入战斗日志</button>";
            html += "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='clearCareerChange'>清除转职记录</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='exportCareerChange'>导出转职记录</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='importCareerChange'>导入转职记录</button>";
            html += "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='clearConsecrateLog'>清除祭奠记录</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='exportConsecrateLog'>导出祭奠记录</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='databaseButton reportButton' id='importConsecrateLog'>导入祭奠记录</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "<tr>";
        }
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

        if (LocalSettingManager.isIncludeExternal()) {
            $("#includeExternal").prop("checked", true);
        }
        $("#includeExternal").on("change", event => {
            const checked = $(event.target).prop("checked") as boolean;
            LocalSettingManager.setIncludeExternal(checked);
        });

        doBindReport1();
        doBindReport2();
        doBindReport3();
        doBindReport4();
        doBindReport5();
        doBindReport6();
        doBindLog1();
        doBindLog2();
        doBindLog3();
        doBindLog4();
        doBindLog5();
        doBindLog6();

        if (TeamMemberLoader.isMaster(credential.id)) {
            doBindClearBattleLog();
            doBindExportBattleLog();
            doBindImportBattleLog();
            doBindClearCareerChange();
            doBindExportCareerChange();
            doBindImportCareerChange();
            doBindClearConsecrateLog();
            doBindExportConsecrateLog();
            doBindImportConsecrateLog();
        }

        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>想不想对自己的团队有更深层次的了解？在让人失望上我们从不让人失望！</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要点名？单击我的头像即可。</b>";
    }

    abstract doBindReturnButton(credential: Credential): void;
}

function doBindReport1() {
    $("#report-1").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        BattleResultStorage.getInstance()
            .loads()
            .then(dataList => {
                const html = new BattleReportGenerator(dataList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindReport2() {
    $("#report-2").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        BattleResultStorage.getInstance()
            .loads()
            .then(dataList => {
                const html = new MonsterReportGenerator(dataList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindReport3() {
    $("#report-3").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        BattleResultStorage.getInstance()
            .loads()
            .then(dataList => {
                new ZodiacReportGenerator(dataList)
                    .includeExternal(includeExternal)
                    .generate();
            });
    });
}

function doBindReport4() {
    $("#report-4").on("click", () => {
        $(".reportButton").prop("disabled", true);
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        new CareerChangeReportGenerator()
            .includeExternal(includeExternal)
            .generateReport()
            .then(() => {
                $(".reportButton").prop("disabled", false);
            });
    });
}

function doBindReport5() {
    $("#report-5").on("click", () => {
        $(".reportButton").prop("disabled", true);
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        new TreasureReportGenerator()
            .includeExternal(includeExternal)
            .generateReport()
            .then(() => {
                $(".reportButton").prop("disabled", false);
            });
    });
}

function doBindReport6() {
    $("#report-6").on("click", () => {
        $(".reportButton").prop("disabled", true);
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        new ConsecrateReportGenerator()
            .includeExternal(includeExternal)
            .generateReport()
            .then(() => {
                $(".reportButton").prop("disabled", false);
            });
    });
}

function doBindLog1() {
    $("#log-1").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        BattleLogStorage.getInstance()
            .findByCreateTime(DayRange.current().start)
            .then(logList => {
                const html = new DailyReportGenerator(logList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindLog2() {
    $("#log-2").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        const yesterday = DayRange.current().previous();
        BattleLogStorage.getInstance()
            .findByCreateTime(yesterday.start, yesterday.end)
            .then(logList => {
                const html = new DailyReportGenerator(logList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindLog3() {
    $("#log-3").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        BattleLogStorage.getInstance()
            .findByCreateTime(WeekRange.current().start)
            .then(logList => {
                const html = new WeeklyReportGenerator(logList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindLog4() {
    $("#log-4").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        const lastWeek = WeekRange.current().previous();
        BattleLogStorage.getInstance()
            .findByCreateTime(lastWeek.start, lastWeek.end)
            .then(logList => {
                const html = new WeeklyReportGenerator(logList)
                    .includeExternal(includeExternal)
                    .generate();
                $("#statistics").html(html).parent().show();
            });
    });
}

function doBindLog5() {
    $("#log-5").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        new MonthlyReportGenerator(MonthRange.current())
            .includeExternal(includeExternal)
            .generate();
    });
}

function doBindLog6() {
    $("#log-6").on("click", () => {
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        new MonthlyReportGenerator(MonthRange.current().previous())
            .includeExternal(includeExternal)
            .generate();
    });
}

function doBindClearBattleLog() {
    $("#clearBattleLog").on("click", () => {
        if (!confirm("战斗记录一旦清除就彻底丢失了，正常玩家不需要执行此操作！")) {
            return;
        }
        if (!confirm("二次确认！战斗记录真的清除后就彻底丢失，有造成数据不一致的隐患。不明白数据同步含义的不要执行！")) {
            return;
        }
        if (!confirm("最终确认！你要确认你在做什么！免责声明：每个人都是自己数据的唯一责任人！")) {
            return;
        }

        $(".databaseButton").prop("disabled", true);
        BattleLogStorage.getInstance()
            .clear()
            .then(() => {
                BattleResultStorage.getInstance()
                    .clear()
                    .then(() => {
                        const message: string = "<b style='font-weight:bold;font-size:300%;color:red'>所有战斗记录数据已经全部清除！</b>";
                        $("#statistics").html(message).parent().show();
                        $(".databaseButton").prop("disabled", false);
                    });
            });
    });
}

function doBindExportBattleLog() {
    $("#exportBattleLog").on("click", () => {
        $(".databaseButton").prop("disabled", true);

        const target = $("#teamMemberSelect").val()! as string;

        // 上个月的第一天00:00:00.000作为查询起始时间
        const startTime = MonthRange.current().previous().start;
        BattleLogStorage.getInstance()
            .findByCreateTime(startTime)
            .then(logList => {
                const documentList = logList
                    .filter(it => target === "" || target === it.roleId)
                    .map(it => it.asObject());

                const json = JSON.stringify(documentList);

                const html = "<textarea id='exportBattleLogData' " +
                    "rows='15' spellcheck='false' " +
                    "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                    "</textarea>";
                $("#statistics").html(html).parent().show();

                $("#exportBattleLogData").val(json);

                $(".databaseButton").prop("disabled", false);
            });
    });
}

function doBindImportBattleLog() {
    $("#importBattleLog").on("click", () => {
        if ($("#battleLogData").length === 0) {
            let html = "";
            html += "<table style='background-color:transparent;border-width:0;border-spacing:0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='text-align:center;background-color:navy;color:yellow'>将待导入的战斗日志数据粘贴到下方文本框，然后再次点击“导入战斗日志”按钮。</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<textarea id='battleLogData' " +
                "rows='15' spellcheck='false' " +
                "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                "</textarea>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#statistics").html(html).parent().show();
        } else {
            const json = $("#battleLogData").val() as string;
            if (json !== "") {
                $(".databaseButton").prop("disabled", true);

                let html = "";
                html += "<table style='background-color:#888888;text-align:center;margin:auto;'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>战斗日志条目</th>";
                html += "<td style='background-color:#F8F0E0' id='battleLogCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>重复战斗日志条目</th>";
                html += "<td style='background-color:#F8F0E0;color:red' id='duplicatedBattleLogCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>导入战斗日志条目</th>";
                html += "<td style='background-color:#F8F0E0;color:blue' id='importedBattleLogCount'>0</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $("#statistics").html(html).parent().show();

                BattleLogService.importBattleLog(json);
                $(".databaseButton").prop("disabled", false);
            }
        }
    });
}

function doBindClearCareerChange() {
    $("#clearCareerChange").on("click", () => {
        if (!confirm("转职记录一旦清除就彻底丢失了，正常玩家不需要执行此操作！")) {
            return;
        }
        if (!confirm("二次确认！转职记录真的清除后就彻底丢失，有造成数据不一致的隐患。不明白数据同步含义的不要执行！")) {
            return;
        }
        if (!confirm("最终确认！你要确认你在做什么！免责声明：每个人都是自己数据的唯一责任人！")) {
            return;
        }

        $(".databaseButton").prop("disabled", true);
        CareerChangeLogStorage.getInstance().clear().then(() => {
            const message: string = "<b style='font-weight:bold;font-size:300%;color:red'>所有转职记录数据已经全部清除！</b>";
            $("#statistics").html(message).parent().show();
            $(".databaseButton").prop("disabled", false);
        });
    });
}

function doBindExportCareerChange() {
    $("#exportCareerChange").on("click", () => {
        $(".databaseButton").prop("disabled", true);
        CareerChangeLogStorage.getInstance().loads().then(dataList => {
            const documentList = dataList.map(it => it.asDocument());
            const json = JSON.stringify(documentList);
            const html = "<textarea id='exportCareerChangeData' " +
                "rows='15' spellcheck='false' " +
                "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                "</textarea>";
            $("#statistics").html(html).parent().show();
            $("#exportCareerChangeData").val(json);
            $(".databaseButton").prop("disabled", false);
        });
    });
}

function doBindImportCareerChange() {
    $("#importCareerChange").on("click", () => {
        if ($("#careerChangeData").length === 0) {
            let html = "";
            html += "<table style='background-color:transparent;border-width:0;border-spacing:0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='text-align:center;background-color:navy;color:yellow'>将待导入的转职记录数据粘贴到下方文本框，然后再次点击“导入战斗日志”按钮。</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<textarea id='careerChangeData' " +
                "rows='15' spellcheck='false' " +
                "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                "</textarea>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#statistics").html(html).parent().show();
        } else {
            const json = $("#careerChangeData").val() as string;
            if (json !== "") {
                $(".databaseButton").prop("disabled", true);

                let html = "";
                html += "<table style='background-color:#888888;text-align:center;margin:auto;'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>转职记录条目</th>";
                html += "<td style='background-color:#F8F0E0' id='careerChangeCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>重复转职记录条目</th>";
                html += "<td style='background-color:#F8F0E0;color:red' id='duplicatedCareerChangeCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>导入转职记录条目</th>";
                html += "<td style='background-color:#F8F0E0;color:blue' id='importedCareerChangeCount'>0</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $("#statistics").html(html).parent().show();

                CareerChangeLogStorage.getInstance()
                    .importFromJson(json)
                    .then(() => $(".databaseButton").prop("disabled", false));
            }
        }
    });
}

function doBindClearConsecrateLog() {
    $("#clearConsecrateLog").on("click", () => {
        if (!confirm("祭奠记录一旦清除就彻底丢失了，正常玩家不需要执行此操作！")) {
            return;
        }
        if (!confirm("二次确认！祭奠记录真的清除后就彻底丢失，有造成数据不一致的隐患。不明白数据同步含义的不要执行！")) {
            return;
        }
        if (!confirm("最终确认！你要确认你在做什么！免责声明：每个人都是自己数据的唯一责任人！")) {
            return;
        }

        $(".databaseButton").prop("disabled", true);
        EquipmentConsecrateLogStorage.getInstance().clear().then(() => {
            const message: string = "<b style='font-weight:bold;font-size:300%;color:red'>所有祭奠记录数据已经全部清除！</b>";
            $("#statistics").html(message).parent().show();
            $(".databaseButton").prop("disabled", false);
        });
    });
}

function doBindExportConsecrateLog() {
    $("#exportConsecrateLog").on("click", () => {
        $(".databaseButton").prop("disabled", true);
        EquipmentConsecrateLogStorage.getInstance().loads().then(dataList => {
            const documentList = dataList.map(it => it.asDocument());
            const json = JSON.stringify(documentList);
            const html = "<textarea id='exportConsecrateLogData' " +
                "rows='15' spellcheck='false' " +
                "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                "</textarea>";
            $("#statistics").html(html).parent().show();
            $("#exportConsecrateLogData").val(json);
            $(".databaseButton").prop("disabled", false);
        });
    });
}

function doBindImportConsecrateLog() {
    $("#importConsecrateLog").on("click", () => {
        if ($("#consecrateLogData").length === 0) {
            let html = "";
            html += "<table style='background-color:transparent;border-width:0;border-spacing:0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='text-align:center;background-color:navy;color:yellow'>将待导入的祭奠记录数据粘贴到下方文本框，然后再次点击“导入战斗日志”按钮。</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>";
            html += "<textarea id='consecrateLogData' " +
                "rows='15' spellcheck='false' " +
                "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
                "</textarea>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#statistics").html(html).parent().show();
        } else {
            const json = $("#consecrateLogData").val() as string;
            if (json !== "") {
                $(".databaseButton").prop("disabled", true);

                let html = "";
                html += "<table style='background-color:#888888;text-align:center;margin:auto;'>";
                html += "<tbody>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>祭奠记录条目</th>";
                html += "<td style='background-color:#F8F0E0' id='consecrateLogCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>重复祭奠记录条目</th>";
                html += "<td style='background-color:#F8F0E0;color:red' id='duplicatedConsecrateLogCount'>0</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th style='background-color:#F8F0E0'>导入祭奠记录条目</th>";
                html += "<td style='background-color:#F8F0E0;color:blue' id='importedConsecrateLogCount'>0</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                $("#statistics").html(html).parent().show();

                EquipmentConsecrateLogStorage.getInstance()
                    .importFromJson(json)
                    .then(() => $(".databaseButton").prop("disabled", false));
            }
        }
    });
}

export = PersonalStatisticsPageProcessor;