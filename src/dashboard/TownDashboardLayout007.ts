import _ from "lodash";
import BattleFieldConfigLoader from "../config/BattleFieldConfigLoader";
import SetupLoader from "../config/SetupLoader";
import BattleProcessor from "../core/battle/BattleProcessor";
import BattleRecord from "../core/battle/BattleRecord";
import BattleReturnInterceptor from "../core/battle/BattleReturnInterceptor";
import BattleStorageManager from "../core/battle/BattleStorageManager";
import DashboardPageUtils from "../core/dashboard/DashboardPageUtils";
import TownDashboardPage from "../core/dashboard/TownDashboardPage";
import PalaceTaskManager from "../core/task/PalaceTaskManager";
import TownDashboardTaxManager from "../core/town/TownDashboardTaxManager";
import PersonalStatus from "../pocketrose/PersonalStatus";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import PageUtils from "../util/PageUtils";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout007 extends TownDashboardLayout {

    id(): number {
        return 7;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("#leftPanel")
            .removeAttr("width")
            .css("width", "40%")
            .find("> table:first")
            .removeAttr("width")
            .css("width", "95%");
        $("#rightPanel")
            .removeAttr("width")
            .css("width", "60%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((idx, tr) => {
                const tax = page.townTax!;
                $(tr).after($("" +
                    "<tr class='roleStatus'>" +
                    "<td height='5'>收益</td><th id='townTax'>" + tax + "</th>" +
                    "<td>ＲＰ</td><th id='additionalRP'>-</th>" +
                    "</tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
            });
        new PersonalStatus(credential, page.townId)
            .load()
            .then(role => {
                $("#additionalRP").html(() => DashboardPageUtils.generateAdditionalRPHtml(role.additionalRP));
            });

        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .attr("id", "roleTitle")
            .parent()
            .next().addClass("roleStatus")
            .next().addClass("roleStatus")
            .next().addClass("roleStatus");

        $("#roleTitle")
            .parent()
            .after($("<tr class='additionalStatus' style='display:none'><td colspan='4'></td></tr>"));

        // 在右面板最后增加一个新行，高度100%，保证格式显示不会变形。
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:last")
            .find("> td:first")
            .removeAttr("colspan")
            .parent()
            .after($("<tr style='height:100%'><td></td></tr>"));

        $("#leftPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .find("> font:first")
            .attr("id", "battlePanelTitle")
            .parent()
            .parent()
            .next()
            .removeAttr("bgcolor")
            .html("<td style='text-align:center' id='battlePanel'></td>")
            .next().hide()
            .find("> td:first")
            .removeAttr("bgcolor")
            .attr("id", "battleMenu")
            .css("text-align", "center")
            .html("")
            .parent()
            .next()
            .css("height", "100%")
            .find("> td:first")
            .html("" +
                "<div style='display:none' id='hidden-1'></div>" +
                "<div style='display:none' id='hidden-2'></div>" +
                "<div style='display:none' id='hidden-3'></div>" +
                "<div style='display:none' id='hidden-4'></div>" +
                "<div style='display:none' id='hidden-5'></div>" +
                "");

        BattleStorageManager.getBattleRecordStorage().load(credential.id).then(record => {
            const lastBattle = record.html!;
            if (lastBattle.includes("吐故纳新，扶摇直上")) {
                $("#battlePanel").css("background-color", "wheat");
            }
            $("#battlePanel").html(lastBattle);
        });


        // 战斗布局只支持标准的战斗
        doProcessBattleLevel();

        $("#battleButton")
            .attr("type", "button")
            .on("click", () => {
                $("#refreshButton").hide();
                $("#battleButton").hide();

                const request = credential.asRequestMap();
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> input:hidden")
                    .filter((idx, input) => $(input).attr("name") !== "id")
                    .filter((idx, input) => $(input).attr("name") !== "pass")
                    .each((idx, input) => {
                        const name = $(input).attr("name")!;
                        const value = $(input).val()! as string;
                        request.set(name, value);
                    });
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> select[name='level']")
                    .each((idx, select) => {
                        const value = $(select).val()! as string;
                        // noinspection JSDeprecatedSymbols
                        request.set("level", escape(value));
                    });

                const battleCount = _.parseInt(request.get("ktotal")!);

                NetworkUtils.post("battle.cgi", request).then(html => {
                    if (html.includes("ERROR !")) {
                        let errMsg = $(html).find("font:first").html();
                        errMsg = "<p style='color:red;font-size:200%'>" + errMsg + "</p>";
                        $("#battlePanel").html(errMsg);

                        const record = new BattleRecord();
                        record.id = credential.id;
                        record.html = errMsg;
                        BattleStorageManager.getBattleRecordStorage().write(record).then();

                        $("#battleMenu").html("" +
                            "<button role='button' class='battleButton' " +
                            "id='battleReturn' style='font-size:150%'>返回</button>" +
                            "")
                            .parent().show();
                        $("#battleReturn").on("click", () => {
                            $("#battleReturn").prop("disabled", true);
                            const request = credential.asRequestMap();
                            request.set("mode", "STATUS");
                            NetworkUtils.post("status.cgi", request)
                                .then(mainPage => {
                                    doProcessBattleReturn(credential, mainPage);
                                });
                        });
                        $(".battleButton").trigger("click");
                        return;
                    }

                    const currentBattleCount = battleCount + 1;

                    const processor = new BattleProcessor(credential, html, currentBattleCount);
                    processor.doProcess();

                    $("#battlePanel").html(processor.obtainPage.reportHtml!);
                    if (processor.obtainPage.reportHtml!.includes("吐故纳新，扶摇直上")) {
                        $("#battlePanel")
                            .css("background-color", "wheat")
                            .css("text-align", "center");
                    } else {
                        $("#battlePanel")
                            .removeAttr("style")
                            .css("text-align", "center");
                    }

                    const recommendation = processor.obtainRecommendation;
                    switch (recommendation) {
                        case "修":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleRepair' style='font-size:150%'>修理</button>" +
                                "")
                                .parent().show();
                            break;
                        case "宿":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleLodge' style='font-size:150%'>住宿</button>" +
                                "")
                                .parent().show();
                            break;
                        case "存":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleDeposit' style='font-size:150%'>存钱</button>" +
                                "")
                                .parent().show();
                            break;
                        case "回":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleReturn' style='font-size:150%'>返回</button>" +
                                "")
                                .parent().show();
                            break;
                    }

                    $("#battleReturn").on("click", () => {
                        $("#battleReturn").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                const request = credential.asRequestMap();
                                request.set("mode", "STATUS");
                                NetworkUtils.post("status.cgi", request)
                                    .then(mainPage => {
                                        doProcessBattleReturn(credential, mainPage, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                                    });
                            });
                    });
                    $("#battleDeposit").on("click", () => {
                        $("#battleDeposit").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                const request = credential.asRequestMap();
                                request.set("azukeru", "all");
                                request.set("mode", "BANK_SELL");
                                NetworkUtils.post("town.cgi", request)
                                    .then(mainPage => {
                                        doProcessBattleReturn(credential, mainPage, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                                    });
                            });
                    });
                    $("#battleRepair").on("click", () => {
                        $("#battleRepair").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                const request = credential.asRequestMap();
                                request.set("arm_mode", "all");
                                request.set("mode", "MY_ARM2");
                                NetworkUtils.post("town.cgi", request)
                                    .then(mainPage => {
                                        doProcessBattleReturn(credential, mainPage, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                                    });
                            });
                    });
                    $("#battleLodge").on("click", () => {
                        $("#battleLodge").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                const request = credential.asRequestMap();
                                request.set("mode", "RECOVERY");
                                NetworkUtils.post("town.cgi", request)
                                    .then(mainPage => {
                                        doProcessBattleReturn(credential, mainPage, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                                    });
                            });
                    });

                    // 战斗布局模式默认开启极速战斗
                    $(".battleButton").trigger("click");
                });
            });
    }

}

function doProcessBattleLevel() {
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("秘宝之岛")) {
            // do nothing, keep
        } else if (text.startsWith("初级之森")) {
            // do nothing, keep
        } else if (text.startsWith("中级之塔")) {
            // do nothing, keep
        } else if (text.startsWith("上级之洞")) {
            // do nothing, keep
        } else if (text.startsWith("十二神殿")) {
            // do nothing, keep
        } else if (text.startsWith("------")) {
            // do nothing, keep
        } else {
            $(option).remove();
        }
    });
}

function doProcessBattleReturn(credential: Credential,
                               mainPage: string,
                               additionalRP?: number,
                               harvestList?: string[]) {
    $(".battleButton").off("click");
    $("#battleMenu").html("").parent().hide();
    $("#refreshButton").show();
    $("#battleButton").show();

    const page = TownDashboardPage.parse(mainPage);

    // 更新首页战斗相关的选项
    // ktotal
    $("input:hidden[name='ktotal']").val(page.role!.battleCount!);
    // session id
    $("input:hidden[name='sessionid']").val(() => {
        return $(mainPage).find("input:hidden[name='sessionid']").val() as string;
    });
    // level
    $("select[name='level']").html(() => {
        return $(mainPage).find("select[name='level']").html();
    });
    doProcessBattleLevel();

    _renderBattleMenu(credential);

    // verification code picture
    $("select[name='level']").closest("form")
        .find("> img:first")
        .each((idx, img) => {
            const src = $(mainPage).find("select[name='level']")
                .closest("form")
                .find("> img:first")
                .attr("src") as string;
            $(img).attr("src", src);
        });

    // 更新战斗倒计时部分
    $("#messageNotification")
        .parent()
        .next()
        .next()
        .find("> th:first")
        .html(() => {
            return $(mainPage).find("form[action='battle.cgi']")
                .closest("table")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> th:first")
                .html();
        });
    if (SetupLoader.isConsecrateStateRecognizeEnabled(credential.id) && page.role!.canConsecrate!) {
        $("#messageNotification")
            .parent()
            .next()
            .find("> th:first")
            .css("color", "red")
            .css("font-size", "120%");
    }

    const clock = $("input:text[name='clock']");
    if (clock.length > 0) {
        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            let fontSize = 100 * enlargeRatio;
            clock.css("font-size", fontSize + "%");
        }
        let timeout = _.parseInt(clock.val() as string);
        if (timeout > 0) {
            const start = Date.now() / 1000;
            _countDownClock(timeout, start, clock);
        }
    }


    // 更新首页的变化
    _renderOnlineList(page);
    _renderMessageNotification(page);
    _renderPalaceTask(credential);
    _renderEventBoard(page);
    _renderConversation(mainPage);

    if (page.role!.level === 150) {
        if (!SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
            $("#battleCell").css("background-color", "red");
        }
    }
    if (page.role!.level !== 150 && (page.role!.attack === 375 || page.role!.defense === 375
        || page.role!.specialAttack === 375 || page.role!.specialDefense === 375 || page.role!.speed === 375)) {
        $("#battleCell").css("background-color", "yellow");
    }

    $("#role_battle_count").text(page.role!.battleCount!);
    $("#role_health").text(page.role!.health + "/" + page.role!.maxHealth);
    $("#role_mana").text(page.role!.mana + "/" + page.role!.maxMana);
    $("#role_cash").text(page.role!.cash + " Gold");
    $("#role_experience").each((idx, th) => {
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            if (page.role!.level === 150) {
                $(th).attr("style", "color: blue").text("MAX");
            } else {
                const ratio = page.role!.level! / 150;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                const exp = page.role!.experience + " EX";
                $(th).html("<span title='" + exp + "'>" + progressBar + "</span>");
            }
        } else {
            $(th).text(page.role!.experience + " EX");
        }
    });
    $("#townTax").off("click").text(page.townTax!);
    new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));

    if (additionalRP) {
        $("#additionalRP").html(() => DashboardPageUtils.generateAdditionalRPHtml(additionalRP));
    }
    if (harvestList && harvestList.length > 0) {
        // 有入手，其中有可能是干拔了，重新刷新一下RP吧。毕竟入手是小概率事件。
        new PersonalStatus(credential)
            .load()
            .then(role => {
                $("#additionalRP").html(() => DashboardPageUtils.generateAdditionalRPHtml(role.additionalRP));
            });
    }
}

function _countDownClock(timeout: number, start: number, clock: JQuery) {
    let now = Date.now() / 1000;
    let x = timeout - (now - start);
    clock.val(_.max([_.ceil(x), 0])!);
    if (x > 0) {
        setTimeout(() => {
            _countDownClock(timeout, start, clock);
        }, 100);
    } else {
        // @ts-ignore
        document.getElementById("mplayer")?.play();
    }
}

function _renderBattleMenu(credential: Credential) {
    const preference = new BattleFieldConfigLoader(credential).loadConfig();
    let count = 0;
    // @ts-ignore
    if (preference["primary"]) {
        count++;
    }
    // @ts-ignore
    if (preference["junior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["senior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["zodiac"]) {
        count++;
    }
    if (count === 0) {
        // 没有设置战斗场所偏好，忽略
        return;
    }

    // 设置了战斗场所偏好
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("秘宝之岛")) {
            // do nothing, keep
        } else if (text.startsWith("初级之森")) {
            // do nothing, keep
        } else if (text.startsWith("中级之塔")) {
            // do nothing, keep
        } else if (text.startsWith("上级之洞")) {
            // do nothing, keep
        } else if (text.startsWith("十二神殿")) {
            // do nothing, keep
        } else if (text.startsWith("------")) {
            // do nothing, keep
        } else {
            $(option).remove();
        }
    });
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("初级之森")) {
            // @ts-ignore
            if (!preference["primary"]) {
                $(option).remove();
            }
        } else if (text.startsWith("中级之塔")) {
            // @ts-ignore
            if (!preference["junior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("上级之洞")) {
            // @ts-ignore
            if (!preference["senior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("十二神殿")) {
            // @ts-ignore
            if (!preference["zodiac"]) {
                $(option).remove();
            }
        }
    });
    // 删除连续的分隔线
    let delimMatch = false;
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("------")) {
            if (!delimMatch) {
                delimMatch = true;
            } else {
                $(option).remove();
            }
        } else {
            delimMatch = false;
        }
    });
    // 删除头尾的分隔线
    if ($("select[name='level']").find("option:last").text().startsWith("------")) {
        $("select[name='level']").find("option:last").remove();
    }
    if ($("select[name='level']").find("option:first").text().startsWith("------")) {
        $("select[name='level']").find("option:first").remove();
    }

}

function _renderOnlineList(page: TownDashboardPage) {
    $("table:first")
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .html((idx, eh) => {
            return page.onlineListHtml!;
        });
}

function _renderMessageNotification(page: TownDashboardPage) {
    $("#messageNotification").html(page.messageNotificationHtml!);
}

function _renderPalaceTask(credential: Credential) {
    if (SetupLoader.isNewPalaceTaskEnabled()) {
        new PalaceTaskManager(credential)
            .monsterTaskHtml()
            .then(monsterTask => {
                if (monsterTask !== "") {
                    $("#palaceTask").html(monsterTask).parent().show();
                }
            })
    }
}

function _renderEventBoard(page: TownDashboardPage) {
    $("#eventBoard").html(page.eventBoardHtml!);
}

function _renderConversation(mainPage: string) {
    $("table:first")
        .next()     // conversation table
        .html((idx, eh) => {
            return $(mainPage).find("input:submit[value='阅读留言']")
                .parent()   // form
                .parent()   // td
                .parent()   // tr
                .parent()   // tbody
                .parent()   // table
                .html();
        });
    $("input:text[name='message']").attr("id", "messageInputText");
}

export = TownDashboardLayout007;