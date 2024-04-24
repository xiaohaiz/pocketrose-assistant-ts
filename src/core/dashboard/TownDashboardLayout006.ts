import _ from "lodash";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import BattlePage from "../battle/BattlePage";
import BattleProcessor from "../battle/BattleProcessor";
import BattleRecord from "../battle/BattleRecord";
import BattleRecordStorage from "../battle/BattleRecordStorage";
import SetupLoader from "../config/SetupLoader";
import TownInn from "../inn/TownInn";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import TownDashboardKeyboardManager from "./TownDashboardKeyboardManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardPage from "./TownDashboardPage";
import BattleReturnInterceptor from "../battle/BattleReturnInterceptor";
import {BattleFailureRecordManager} from "../battle/BattleFailureRecordManager";
import {BattleConfigManager} from "../config/ConfigManager";
import {ValidationCodeTrigger} from "../trigger/ValidationCodeTrigger";

class TownDashboardLayout006 extends TownDashboardLayout {

    id(): number {
        return 6;
    }

    battleMode(): boolean {
        return true;
    }

    render2(credential: Credential, page: TownDashboardPage, validationCodeTrigger?: ValidationCodeTrigger): void {
        $("center:first").hide();
        $("br:first").hide();

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first").hide();

        $("#leftPanel").hide();

        $("#rightPanel")
            .removeAttr("width")
            .css("width", "100%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .css("font-size", "200%");

        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((idx, tr) => {
                const tax = page.townTax!;
                $(tr).after($("<tr><td height='5'>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
            });

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first").hide()
            .next()
            .next()
            .find("> td:first")
            .removeAttr("width")
            .css("width", "100%")
            .next().hide();

        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            const fontSize = 100 * enlargeRatio;
            $("#battleCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#townCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#personalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryNormalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryAdvancedCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
        }
        $("#battleCell")
            .parent()
            .before($("<tr><td colspan='4'>　</td></tr>"))
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#townCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#personalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#countryNormalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
    }

    render3(credential: Credential, page: TownDashboardPage, validationCodeTrigger?: ValidationCodeTrigger): void {
        this.render2(credential, page, validationCodeTrigger);
        $("#townTax").off("click");

        let tr1 = "";
        let tr2 = "";
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .each((idx, tr) => {
                tr1 = $(tr).html();
            })
            .next()
            .each((idx, tr) => {
                tr2 = $(tr).html();
            });
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((idx, tr) => {
                $(tr).remove();
            });
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .prepend("<tr>" + tr2 + "</tr>");
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .prepend("<tr>" + tr1 + "</tr>");

        if (validationCodeTrigger) {
            validationCodeTrigger!.safe = () => {
                $("#ID_DANGEROUS").text("SAFE");
                const element = $("#battleCell").prev();
                element.find("> span:first").remove();
                element.find("> br:first").remove();// 如果安全按钮启用了，就不要显示了，交给安全按钮定时器去干活
                const configManager = new BattleConfigManager(credential);
                if (!BattleConfigManager.isSafeBattleButtonEnabled()) {
                    const battleButton = $("#battleButton");
                    battleButton.prop("disabled", false).show();
                }
            };
            validationCodeTrigger!.warning = count => {
                $("#ID_DANGEROUS").text("SAFE");
                const element = $("#battleCell").prev();
                element.find("> span:first").remove();
                element.find("> br").remove();
                element.prepend($("" +
                    "<span style='background-color:red;color:white;font-weight:bold;font-size:120%'>" +
                    "验证错" + count + "次" +
                    "</span>" +
                    "<br><br><br><br>" +
                    ""));
                const configManager = new BattleConfigManager(credential);
                if (!BattleConfigManager.isSafeBattleButtonEnabled()) {
                    const battleButton = $("#battleButton");
                    battleButton.prop("disabled", false).show();
                }
            };
            validationCodeTrigger!.danger = () => {
                $("#ID_DANGEROUS").text("DANGEROUS");
                const battleButton = $("#battleButton");
                battleButton.prop("disabled", true).hide();
            };
            validationCodeTrigger!.triggerStartup().then();
        }

        new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
    }

    async render(credential: Credential, page: TownDashboardPage, validationCodeTrigger?: ValidationCodeTrigger): Promise<void> {
        this.render3(credential, page, validationCodeTrigger);

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first")
            .before($("" +
                "<tr style='display:none'><td id='hidden-1'></td></tr>" +
                "<tr style='display:none'><td id='hidden-2'></td></tr>" +
                "<tr style='display:none'><td id='hidden-3'></td></tr>" +
                "<tr style='display:none'><td id='hidden-4'></td></tr>" +
                "<tr style='display:none'><td id='hidden-5'></td></tr>" +
                "<tr style='display:none'><td id='battleMenu' style='text-align:center'></td></tr>" +
                "<tr><td id='battlePanel' style='text-align:center'></td></tr>"));

        generateDepositForm(credential);
        generateRepairForm(credential);
        generateLodgeForm(credential);

        BattleRecordStorage.load(credential.id).then(record => {
            if (record?.available) {
                const lastBattle = record.html!;

                // 提示入手 sephirothy
                if (record.hasAdditionalNotification) {
                    const additionalNotifications: string[] = [];
                    const harvestList = record.harvestList;
                    if (harvestList && harvestList.length > 0) {
                        for (const ht of harvestList) {
                            additionalNotifications.push("<span style='color:red;font-size:200%'>" + ht + "</span>");
                        }
                    }
                    if (record.petEggHatched) {
                        additionalNotifications.push("<span style='color:blue;font-size:200%'>" + "宠物蛋孵化成功！" + "</span>");
                    }
                    if (record.petSpellLearned) {
                        additionalNotifications.push("<span style='color:blue;font-size:200%'>" + "宠物学会了新技能！" + "</span>");
                    }
                    if (record.validationCodeFailed) {
                        additionalNotifications.push("<span style='color:red;font-size:200%'>" + "选择验证码错误！" + "</span>");
                    }
                    const anHtml = _.join(additionalNotifications, "<br>");
                    $("#harvestInfo").html(anHtml).parent().show();
                } else {
                    $("#harvestInfo").html("").parent().hide();
                }

                if (lastBattle.includes("吐故纳新，扶摇直上") && lastBattle.includes("孵化成功")) {
                    $("#battlePanel").css("background-color", "yellow");
                } else if (lastBattle.includes("吐故纳新，扶摇直上")) {
                    $("#battlePanel").css("background-color", "wheat");
                } else if (lastBattle.includes("孵化成功")) {
                    $("#battlePanel").css("background-color", "skyblue");
                }
                $("#battlePanel").html(lastBattle);
            }
        });


        new TownDashboardKeyboardManager(credential, page.battleLevelShortcut, page).bind();

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
                        const validationCodeFailed = errMsg.includes("选择验证码错误");
                        errMsg = "<p style='color:red;font-size:200%'>" + errMsg + "</p>";
                        $("#battlePanel").html(errMsg);

                        const record = new BattleRecord();
                        record.id = credential.id;
                        record.html = errMsg;
                        record.validationCodeFailed = validationCodeFailed;
                        BattleRecordStorage.write(record).then();
                        if (validationCodeFailed) {
                            new BattleFailureRecordManager(credential).onValidationCodeFailure().then(() => {
                                validationCodeTrigger?.triggerStartup().then();
                            });
                        }

                        $("#battleMenu").html("" +
                            "<button role='button' class='battleButton' " +
                            "id='battleReturn' style='font-size:150%'>返回</button>" +
                            "")
                            .parent().show();
                        $("#battleReturn").on("click", () => {
                            $("#battleReturn").prop("disabled", true);
                            $("#refreshButton").trigger("click");
                        });
                        $(".battleButton").trigger("click");
                        return;
                    }

                    const currentBattleCount = battleCount + 1;

                    const processor = new BattleProcessor(credential, html, currentBattleCount);
                    processor.doProcess().then(() => {
                        $("#battlePanel").html(processor.obtainPage!.reportHtml!);

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
                            doBeforeReturn(credential, currentBattleCount, processor.obtainPage).then(() => {
                                $("#refreshButton").trigger("click");
                            });
                        });
                        $("#battleDeposit").on("click", () => {
                            $("#battleDeposit").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount, processor.obtainPage)
                                .then(() => {
                                    if (processor.obtainPage.zodiacBattle) {
                                        new TownInn(credential).recovery()
                                            .then(() => {
                                                $("#deposit").trigger("click");
                                            });
                                    } else {
                                        $("#deposit").trigger("click");
                                    }
                                });
                        });
                        $("#battleRepair").on("click", () => {
                            $("#battleRepair").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount, processor.obtainPage).then(() => {
                                $("#repair").trigger("click");
                            });
                        });
                        $("#battleLodge").on("click", () => {
                            $("#battleLodge").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount, processor.obtainPage).then(() => {
                                $("#lodge").trigger("click");
                            });
                        });

                        // 战斗布局模式默认开启极速战斗
                        $(".battleButton").trigger("click");
                    });
                });
            });
    }

}

function generateDepositForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='azukeru' value='all'>";
    form += "<input type='hidden' name='mode' value='BANK_SELL'>";
    form += "<input type='submit' id='deposit'>";
    form += "</form>";
    $("#hidden-2").html(form);
}

function generateRepairForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='arm_mode' value='all'>";
    form += "<input type='hidden' name='mode' value='MY_ARM2'>";
    form += "<input type='submit' id='repair'>";
    form += "</form>";
    $("#hidden-3").html(form);
}

function generateLodgeForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='mode' value='RECOVERY'>";
    form += "<input type='submit' id='lodge'>";
    form += "</form>";
    $("#hidden-4").html(form);
}

async function doBeforeReturn(credential: Credential, battleCount: number, battlePage: BattlePage): Promise<void> {
    await new BattleReturnInterceptor(credential, battleCount, battlePage).beforeExitBattle();
}

export = TownDashboardLayout006;