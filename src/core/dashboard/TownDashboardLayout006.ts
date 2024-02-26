import _ from "lodash";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import BattleProcessor from "../battle/BattleProcessor";
import BattleRecord from "../battle/BattleRecord";
import BattleRecordStorage from "../battle/BattleRecordStorage";
import SetupLoader from "../config/SetupLoader";
import EquipmentLocalStorage from "../equipment/EquipmentLocalStorage";
import PetLocalStorage from "../monster/PetLocalStorage";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import KeyboardShortcutManager from "./KeyboardShortcutManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardLayout006 extends TownDashboardLayout {

    id(): number {
        return 6;
    }

    battleMode(): boolean {
        return true;
    }

    render2(credential: Credential, page: TownDashboardPage): void {
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

    render3(credential: Credential, page: TownDashboardPage): void {
        this.render2(credential, page);
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

        new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
    }

    async render(credential: Credential, page: TownDashboardPage): Promise<void> {
        this.render3(credential, page);

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


        new KeyboardShortcutManager(credential, page.battleLevelShortcut, page).bind();

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
                        BattleRecordStorage.getInstance().write(record).then();

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
                            doBeforeReturn(credential, currentBattleCount).then(() => {
                                $("#refreshButton").trigger("click");
                            });
                        });
                        $("#battleDeposit").on("click", () => {
                            $("#battleDeposit").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount).then(() => {
                                $("#deposit").trigger("click");
                            });
                        });
                        $("#battleRepair").on("click", () => {
                            $("#battleRepair").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount).then(() => {
                                $("#repair").trigger("click");
                            });
                        });
                        $("#battleLodge").on("click", () => {
                            $("#battleLodge").prop("disabled", true);
                            doBeforeReturn(credential, currentBattleCount).then(() => {
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

async function doBeforeReturn(credential: Credential, battleCount: number): Promise<void> {
    return await (() => {
        return new Promise<void>(resolve => {
            const petLocalStorage = new PetLocalStorage(credential);
            petLocalStorage
                .triggerUpdatePetMap(battleCount)
                .then(() => {
                    petLocalStorage
                        .triggerUpdatePetStatus(battleCount)
                        .then(() => {
                            new EquipmentLocalStorage(credential)
                                .triggerUpdateEquipmentStatus(battleCount)
                                .then(() => {
                                    resolve();
                                });
                        });
                });
        });
    })();
}

export = TownDashboardLayout006;