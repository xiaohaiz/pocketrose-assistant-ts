import _ from "lodash";
import SetupLoader from "../config/SetupLoader";
import EquipmentLocalStorage from "../core/EquipmentLocalStorage";
import PetLocalStorage from "../core/PetLocalStorage";
import TownDashboardTaxManager from "../core/TownDashboardTaxManager";
import BattlePage from "../pocketrose/BattlePage";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StorageUtils from "../util/StorageUtils";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout005 extends TownDashboardLayout {

    id(): number {
        return 5;
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
                $(tr).after($("<tr><td>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(page).processTownTax($("#townTax"));
            });

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

        generateDepositForm(credential);
        generateRepairForm(credential);
        generateLodgeForm(credential);

        const lastBattle = StorageUtils.getString("_lb_" + credential.id);
        if (lastBattle !== "") {
            $("#battlePanel").html(lastBattle);
        }

        $("#battleButton")
            .attr("type", "button")
            .on("click", () => {
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
                    const page = BattlePage.parse(html);
                    $("#battlePanel").html(page.reportHtml!);

                    StorageUtils.set("_lb_" + credential.id, page.reportHtml!);

                    const currentBattleCount = battleCount + 1;
                    const recommendation = doRecommendation(currentBattleCount, page);
                    switch (recommendation) {
                        case "修":
                            let bt1 = SetupLoader.getBattleRepairButtonText();
                            bt1 = bt1 === "" ? "修理" : _.escape(bt1);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton button-16' " +
                                "id='battleRepair' style='font-size:150%'>" + bt1 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "宿":
                            let bt2 = SetupLoader.getBattleLodgeButtonText();
                            bt2 = bt2 === "" ? "住宿" : _.escape(bt2);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton button-16' " +
                                "id='battleLodge' style='font-size:150%'>" + bt2 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "存":
                            let bt3 = SetupLoader.getBattleDepositButtonText();
                            bt3 = bt3 === "" ? "存钱" : _.escape(bt3);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton button-16' " +
                                "id='battleDeposit' style='font-size:150%'>" + bt3 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "回":
                            let bt4 = SetupLoader.getBattleReturnButtonText();
                            bt4 = bt4 === "" ? "返回" : _.escape(bt4);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton button-16' " +
                                "id='battleReturn' style='font-size:150%'>" + bt4 + "</button>" +
                                "")
                                .parent().show();
                            break;
                    }

                    $(".battleButton").trigger("focus");

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

                    if (page.zodiacBattle!) {
                        // 十二宫极速战斗模式
                        if (SetupLoader.isZodiacFlashBattleEnabled()) {
                            $(".battleButton").trigger("click");
                        }
                    } else {
                        // 普通战斗极速模式
                        if (SetupLoader.isNormalFlashBattleEnabled()) {
                            $(".battleButton").trigger("click");
                        }
                    }
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

function doRecommendation(battleCount: number, page: BattlePage): string {
    if (battleCount % 100 === 0) {
        // 每100战强制修理
        return "修";
    }
    if (page.lowestEndure! < SetupLoader.getRepairMinLimitation()) {
        // 有装备耐久度低于阈值了，强制修理
        return "修";
    }

    if (page.battleResult === "战败") {
        // 战败，转到住宿
        return "宿";
    }
    if (page.zodiacBattle! && page.battleResult === "平手") {
        // 十二宫战斗平手，视为战败，转到住宿
        return "宿";
    }

    if (page.zodiacBattle! || page.treasureBattle!) {
        // 十二宫战胜或者秘宝战胜，转到存钱
        return "存";
    }
    let depositBattleCount = SetupLoader.getDepositBattleCount();
    if (depositBattleCount > 0 && battleCount % depositBattleCount === 0) {
        // 设置的存钱战数到了
        return "存";
    }

    // 生命力低于最大值的配置比例，住宿推荐
    if (SetupLoader.getLodgeHealthLostRatio() > 0 &&
        (page.roleHealth! <= page.roleMaxHealth! * SetupLoader.getLodgeHealthLostRatio())) {
        return "宿";
    }
    // 如果MANA小于50%并且小于配置点数，住宿推荐
    if (SetupLoader.getLodgeManaLostPoint() > 0 &&
        (page.roleMana! <= page.roleMaxMana! * 0.5 && page.roleMana! <= SetupLoader.getLodgeManaLostPoint())) {
        return "宿";
    }

    if (SetupLoader.getDepositBattleCount() > 0) {
        // 设置了定期存钱，但是没有到战数，那么就直接返回吧
        return "回";
    } else {
        // 没有设置定期存钱，那就表示每战都存钱
        return "存";
    }
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

export = TownDashboardLayout005;