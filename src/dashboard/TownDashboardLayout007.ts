import _ from "lodash";
import SetupLoader from "../config/SetupLoader";
import BattleProcessor from "../core/battle/BattleProcessor";
import BattleRecord from "../core/battle/BattleRecord";
import BattleReturnInterceptor from "../core/battle/BattleReturnInterceptor";
import BattleStorageManager from "../core/battle/BattleStorageManager";
import TownDashboardTaxManager from "../core/town/TownDashboardTaxManager";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
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
                $(tr).after($("<tr class='roleStatus'><td height='5'>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
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
                                        doProcessBattleReturn(credential, mainPage);
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
                                        doProcessBattleReturn(credential, mainPage);
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
                                        doProcessBattleReturn(credential, mainPage);
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
                                        doProcessBattleReturn(credential, mainPage);
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

function doProcessBattleReturn(credential: Credential, mainPage: string) {
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
    const clock = $("input:text[name='clock']");
    if (clock.length > 0) {
        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            let fontSize = 100 * enlargeRatio;
            clock.css("font-size", fontSize + "%");
        }
        let timeout = _.parseInt(clock.val() as string);
        if (timeout > 0) {
            const timer = setInterval(() => {
                timeout--;
                clock.val(timeout);
                if (timeout <= 0) {
                    clearInterval(timer);
                    // @ts-ignore
                    document.getElementById("mplayer")?.play();
                }
            }, 1000);
        }
    }


    // 更新首页的战数变化
    $("#role_battle_count").text(page.role!.battleCount!);


}


export = TownDashboardLayout007;