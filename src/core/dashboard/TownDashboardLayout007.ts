import _ from "lodash";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import BattleButtonManager from "../battle/BattleButtonManager";
import BattleProcessor from "../battle/BattleProcessor";
import BattleRecord from "../battle/BattleRecord";
import BattleRecordStorage from "../battle/BattleRecordStorage";
import BattleReturnInterceptor from "../battle/BattleReturnInterceptor";
import BattleScene from "../battle/BattleScene";
import BattleSceneStorage from "../battle/BattleSceneStorage";
import LocalSettingManager from "../config/LocalSettingManager";
import SetupLoader from "../config/SetupLoader";
import TownForge from "../forge/TownForge";
import TownInn from "../inn/TownInn";
import PersonalStatus from "../role/PersonalStatus";
import PalaceTaskManager from "../task/PalaceTaskManager";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import DashboardPageUtils from "./DashboardPageUtils";
import TownDashboardKeyboardManager from "./TownDashboardKeyboardManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardPage from "./TownDashboardPage";
import TownDashboardPageParser from "./TownDashboardPageParser";
import Constants from "../../util/Constants";
import RoleEquipmentStatusStorage from "../equipment/RoleEquipmentStatusStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";

class TownDashboardLayout007 extends TownDashboardLayout {

    id(): number {
        return 7;
    }

    battleMode(): boolean {
        return true;
    }

    async render(credential: Credential, page: TownDashboardPage): Promise<void> {
        $("input[name='watch']")
            .hide()
            .after($("<span style='background-color:lightgreen;font-weight:bold;font-size:120%' " +
                "id='watch2'></span>"));
        _showTime();

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
                    "<td height='5'>职业</td><th id='roleCareer'>-</th>" +
                    "<td>祭奠ＲＰ</td><th id='consecrateRP'>-</th>" +
                    "</tr>" +
                    "<tr class='roleStatus'>" +
                    "<td height='5'>收益</td><th id='townTax'>" + tax + "</th>" +
                    "<td>额外ＲＰ</td><th id='additionalRP'>-</th>" +
                    "</tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
            });
        new PersonalStatus(credential, page.townId)
            .load()
            .then(role => {
                $("#roleCareer").text(role.career!);
                $("#consecrateRP").text(role.consecrateRP!);
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
            .html("<td style='text-align:center;vertical-align:center' id='battlePanel'></td>")
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

        if (SetupLoader.isGemCountVisible()) {
            const fontColor = $("#battlePanelTitle").attr("color") as string;
            let gc = "";
            gc += "<span>&nbsp;&nbsp;&nbsp;</span>";
            gc += "<img src='" + Constants.POCKET_DOMAIN + "/image/item/PowerStone.gif' " +
                "alt='威力宝石' title='威力宝石' height='14' width='14'>";
            gc += "<span id='powerGemCount' style='color:" + fontColor + "'>-</span>";
            gc += "<img src='" + Constants.POCKET_DOMAIN + "/image/item/LuckStone.gif' " +
                "alt='幸运宝石' title='幸运宝石' height='14' width='14'>";
            gc += "<span id='luckGemCount' style='color:" + fontColor + "'>-</span>";
            gc += "<img src='" + Constants.POCKET_DOMAIN + "/image/item/WeightStone.gif' " +
                "alt='重量宝石' title='重量宝石' height='14' width='14'>";
            gc += "<span id='weightGemCount' style='color:" + fontColor + "'>-</span>";
            $("#battlePanelTitle").after($(gc));

            _renderGemCount();
        }

        BattleRecordStorage.getInstance().load(credential.id).then(record => {
            const lastBattle = record.html!;
            if (lastBattle.includes("吐故纳新，扶摇直上") && lastBattle.includes("孵化成功")) {
                $("#battlePanel").css("background-color", "yellow");
            } else if (lastBattle.includes("吐故纳新，扶摇直上")) {
                $("#battlePanel").css("background-color", "wheat");
            } else if (lastBattle.includes("孵化成功")) {
                $("#battlePanel").css("background-color", "skyblue");
            }
            $("#battlePanel").html(lastBattle);
        });

        new TownDashboardKeyboardManager(credential, page.battleLevelShortcut, page).bind();

        $("#battleButton")
            .attr("type", "button")
            .on("click", () => {
                if (BattleButtonManager.isHiddenButtonEnabled()) {
                    $("#refreshButton").hide();
                    $("#battleButton").hide();
                } else {
                    $("#refreshButton").prop("disabled", true);
                    $("#battleButton").prop("disabled", true);
                }

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
                        doProcessBattleVerificationError(credential, html).then(() => {
                            $(".battleButton").trigger("click");
                        });
                        return;
                    }

                    const currentBattleCount = battleCount + 1;

                    doBeforeProcessBattle(credential, currentBattleCount, PageUtils.currentPageHtml(), html, request).then(() => {
                        // 开始处理战斗返回的结果
                        doProcessBattle(credential, html, currentBattleCount).then(() => {
                            // 战斗布局模式默认开启极速战斗
                            $(".battleButton").trigger("click");
                        });
                    });
                });
            });
    }

}

async function doProcessBattleVerificationError(credential: Credential, html: string) {
    let errMsg = $(html).find("font:first").html();
    const validationCodeFailed = errMsg.includes("验证码");
    errMsg = "<p style='color:red;font-size:200%'>" + errMsg + "</p>";
    $("#battlePanel").html(errMsg);

    const record = new BattleRecord();
    record.id = credential.id;
    record.html = errMsg;
    record.validationCodeFailed = validationCodeFailed;
    await BattleRecordStorage.getInstance().write(record);

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
    return await (() => {
        return new Promise<void>(resolve => resolve());
    })();
}

async function doBeforeProcessBattle(credential: Credential,
                                     currentBattleCount: number,
                                     beforePage: string,
                                     afterPage: string,
                                     request: Map<string, string>) {
    const scene = new BattleScene();
    scene.id = credential.id;
    scene.roleId = credential.id;
    scene.beforePage = beforePage;
    scene.afterPage = afterPage;
    const r = {};
    request.forEach((v, k) => {
        // @ts-ignore
        r[k] = v;
    });
    scene.request = JSON.stringify(r);
    await BattleSceneStorage.getInstance().upsert(scene);

    return await (() => {
        return new Promise<void>(resolve => resolve());
    })();
}

async function doProcessBattle(credential: Credential, html: string, currentBattleCount: number) {
    const processor = new BattleProcessor(credential, html, currentBattleCount);
    await processor.doProcess();

    $("#battlePanel").html(processor.obtainPage.reportHtml!);
    if (processor.obtainPage.petLearnSpell && processor.obtainPage.eggBorn) {
        $("#battlePanel")
            .css("background-color", "wheat")
            .css("text-align", "yellow");
    } else if (processor.obtainPage.petLearnSpell) {
        $("#battlePanel")
            .css("background-color", "wheat")
            .css("text-align", "center");
    } else if (processor.obtainPage.eggBorn) {
        $("#battlePanel")
            .css("background-color", "skyblue")
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
        new BattleReturnInterceptor(credential, currentBattleCount, processor.obtainPage)
            .beforeExitBattle()
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
        new BattleReturnInterceptor(credential, currentBattleCount, processor.obtainPage)
            .beforeExitBattle()
            .then(() => {
                const request = credential.asRequestMap();
                request.set("azukeru", "all");
                request.set("mode", "BANK_SELL");
                NetworkUtils.post("town.cgi", request)
                    .then(mainPage => {
                        if (processor.obtainPage.zodiacBattle) {
                            new TownInn(credential).recovery().then(m => {
                                doProcessBattleReturn(credential, m, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                            });
                        } else {
                            doProcessBattleReturn(credential, mainPage, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                        }
                    });
            });
    });
    $("#battleRepair").on("click", () => {
        $("#battleRepair").prop("disabled", true);
        new BattleReturnInterceptor(credential, currentBattleCount, processor.obtainPage)
            .beforeExitBattle()
            .then(() => {
                new TownForge(credential).repairAll().then(m => {
                    doProcessBattleReturn(credential, m, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                });
            });
    });
    $("#battleLodge").on("click", () => {
        $("#battleLodge").prop("disabled", true);
        new BattleReturnInterceptor(credential, currentBattleCount, processor.obtainPage)
            .beforeExitBattle()
            .then(() => {
                new TownInn(credential).recovery().then(m => {
                    doProcessBattleReturn(credential, m, processor.obtainPage.additionalRP, processor.obtainPage.harvestList);
                });
            });
    });

    return await (() => {
        return new Promise<void>(resolve => resolve());
    })();
}

function doProcessBattleReturn(credential: Credential,
                               mainPage: string,
                               additionalRP?: number,
                               harvestList?: string[]) {
    _renderGemCount();

    $("#systemAnnouncement").removeAttr("style");
    $(".battleButton").off("click");
    $("#battleMenu").html("").parent().hide();
    if (BattleButtonManager.isHiddenButtonEnabled()) {
        $("#refreshButton").show();
        $("#battleButton").show();
    } else {
        $("#refreshButton").prop("disabled", false);
        $("#battleButton").prop("disabled", false);
    }

    const parser = new TownDashboardPageParser(credential, mainPage, true);
    const page = parser.parse();

    // 更新首页战斗相关的选项
    // ktotal
    $("input:hidden[name='ktotal']").val(page.obtainRole.battleCount!);
    // session id
    $("input:hidden[name='sessionid']").val(page.battleSessionId!);
    // level
    $("select[name='level']").html(page.processedBattleLevelSelectionHtml!);

    // verification code picture
    $("select[name='level']").closest("form")
        .find("> img:first")
        .attr("src", page.battleVerificationSource!);
    $("a:contains('看不到图片按这里')")
        .filter((idx, a) => $(a).text() === '看不到图片按这里')
        .attr("href", page.battleVerificationSource!);

    // 更新战斗倒计时部分
    $("#messageNotification")
        .parent()
        .next()
        .next()
        .find("> th:first")
        .html(page.actionNotificationHtml!);

    if (SetupLoader.isConsecrateStateRecognizeEnabled(credential.id) && page.role!.canConsecrate!) {
        $("#battleCell")
            .parent()
            .prev()
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

    // 更新：在线列表
    $("#online_list").html(page.onlineListHtml!);

    // 更新：动员指令
    $("#mobilization").find("> form:first")
        .find("> font:first")
        .text(page.processedMobilizationText!);

    // 更新：消息通知
    $("#messageNotification").html(page.messageNotificationHtml!);

    _renderPalaceTask(credential);
    _renderEventBoard(page);
    _renderConversation(page);

    // ------------------------------------------
    // 判断装备或者宠物是否满格了
    // ------------------------------------------
    const fullEquipment = LocalSettingManager.isEquipmentCapacityMax(credential.id);
    const fullPet = LocalSettingManager.isPetCapacityMax(credential.id);
    if (fullEquipment && fullPet) {
        $("#townCell").css("background-color", "orange");
    } else if (fullEquipment) {
        $("#townCell").css("background-color", "yellow");
    } else if (fullPet) {
        $("#townCell").css("background-color", "red");
    }

    // ------------------------------------------
    // 练装备相关的展示
    // ------------------------------------------
    if (LocalSettingManager.isWeaponExperienceMax(credential.id)) {
        $("#personalCell").css("background-color", "#FFC0C0");
    }
    if (LocalSettingManager.isArmorExperienceMax(credential.id)) {
        $("#countryNormalCell").css("background-color", "lightgreen");
    }
    if (LocalSettingManager.isAccessoryExperienceMax(credential.id)) {
        $("#countryAdvancedCell").css("background-color", "lightblue");
    }

    if (page.careerTransferNotification) {
        $("#battleCell").css("background-color", "red");
    }
    if (page.capacityLimitationNotification) {
        $("#battleCell").css("background-color", "yellow");
    }

    $("#role_battle_count").text(page.role!.battleCount!);
    $("#role_health").text(page.role!.health + "/" + page.role!.maxHealth);
    $("#role_mana").text(page.role!.mana + "/" + page.role!.maxMana);
    $("#role_cash").html(page.cashHtml);
    $("#role_experience").html(page.experienceHtml);
    $("#townTax").off("click").text(page.townTax!);
    new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));

    if (additionalRP !== undefined) {
        $("#additionalRP").html(() => DashboardPageUtils.generateAdditionalRPHtml(additionalRP));
    }
    if (harvestList && harvestList.length > 0) {
        // 有入手，其中有可能是干拔了，重新刷新一下RP吧。毕竟入手是小概率事件。
        new PersonalStatus(credential)
            .load()
            .then(role => {
                $("#consecrateRP").text(role.consecrateRP!);
                $("#additionalRP").html(() => DashboardPageUtils.generateAdditionalRPHtml(role.additionalRP));
            });
    }

    new TownDashboardKeyboardManager(credential, page.battleLevelShortcut, page).bind();

    new BattleButtonManager().createSafeBattleButton().then();
}

function _showTime() {
    const date = new Date();
    const h = date.getHours(); // 0 - 23
    const m = date.getMinutes(); // 0 - 59
    const s = date.getSeconds(); // 0 - 59
    const hour = _.padStart(h.toString(), 2, "0");
    const minute = _.padStart(m.toString(), 2, "0");
    const second = _.padStart(s.toString(), 2, "0");
    const time = hour + ":" + minute + ":" + second;
    $("#watch2").html("&nbsp;&nbsp;&nbsp;" + time + "&nbsp;&nbsp;&nbsp;");
    setTimeout(_showTime, 1000);
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

function _renderPalaceTask(credential: Credential) {
    new PalaceTaskManager(credential)
        .monsterTaskHtml()
        .then(monsterTask => {
            if (monsterTask !== "") {
                $("#palaceTask").html(monsterTask).parent().show();
            }
        })
}

function _renderEventBoard(page: TownDashboardPage) {
    $("#eventBoard").html(page.processedEventBoardHtml!);
}

function _renderConversation(page: TownDashboardPage) {
    $("table:first")
        .next()     // conversation table
        .html(page.t1Html!);
    $("input:text[name='message']").attr("id", "messageInputText");
}

function _renderGemCount() {
    if (!SetupLoader.isGemCountVisible()) {
        return;
    }

    const roleIdList: string[] = [];
    const includeExternal = LocalSettingManager.isIncludeExternal();
    for (const roleId of TeamMemberLoader.loadTeamMembersAsMap(includeExternal).keys()) {
        roleIdList.push(roleId);
    }
    const storage = RoleEquipmentStatusStorage.getInstance();
    storage.loads(roleIdList).then(data => {
        let powerGemCount = 0;
        let luckGemCount: number = 0;
        let weightGemCount = 0;
        data.forEach(it => {
            (it.powerGemCount !== undefined) && (powerGemCount += it.powerGemCount);
            (it.luckGemCount !== undefined) && (luckGemCount += it.luckGemCount);
            (it.weightGemCount !== undefined) && (weightGemCount += it.weightGemCount);
        });
        $("#powerGemCount").text(powerGemCount);
        $("#luckGemCount").text(luckGemCount);
        $("#weightGemCount").text(weightGemCount);
    });
}

export = TownDashboardLayout007;