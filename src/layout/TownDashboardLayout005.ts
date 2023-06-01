import _ from "lodash";
import SetupLoader from "../config/SetupLoader";
import EquipmentLocalStorage from "../core/EquipmentLocalStorage";
import PetLocalStorage from "../core/PetLocalStorage";
import TownDashboardTaxManager from "../core/TownDashboardTaxManager";
import BattlePage from "../pocketrose/BattlePage";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalPetManagement from "../pocketrose/PersonalPetManagement";
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

        $("#roleTitle")
            .find("> font:first")
            .on("click", event => {
                $(event.target).off("click");

                new PersonalEquipmentManagement(credential, page.townId)
                    .open()
                    .then(equipmentPage => {
                        new PersonalPetManagement(credential, page.townId)
                            .open()
                            .then(petPage => {

                                let html = "";
                                html += "<table style='text-align:center;margin:auto;border-width:1px;border-spacing:1px;width:100%'>";
                                html += "<tbody>";
                                for (const equipment of equipmentPage.equipmentList!) {
                                    if (!equipment.using) {
                                        continue;
                                    }
                                    html += "<tr>";
                                    html += "<td style='background-color:#E8E8D0'>" + equipment.usingHTML + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + equipment.nameHTML + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + equipment.category + "</td>";
                                    html += "<td style='background-color:#E8E8D0'>" + equipment.experienceHTML + "</td>";
                                    html += "</tr>";
                                }
                                for (const pet of petPage.petList!) {
                                    if (!pet.using) {
                                        continue;
                                    }
                                    html += "<tr>";
                                    html += "<td style='background-color:#E8E8D0'>" + pet.usingHtml + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + pet.nameHtml + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + pet.imageHtml + "</td>";
                                    html += "<td style='background-color:#E8E8D0'>" + pet.levelHtml + "</td>";
                                    html += "</tr>";
                                }
                                html += "</tbody>";
                                html += "</table>";

                                $(".additionalStatus")
                                    .find("> td:first")
                                    .html(html);

                                $(".roleStatus").hide();
                                $(".additionalStatus").show();
                            });
                    });
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
            if (StorageUtils.getBoolean("_pa_055")) {
                const children: JQuery[] = [];
                $("#battlePanel")
                    .html(lastBattle)
                    .find("> *")
                    .each((idx, child) => {
                        const element = $(child);
                        if (element.is("p") || element.is("b")) {
                            element.hide();
                            children.push(element);
                        }
                    });
                _showReportElement(children, 0);
            } else {
                $("#battlePanel")
                    .html(lastBattle);
            }
        }

        // 战斗布局只支持以下战斗
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
                        StorageUtils.set("_lb_" + credential.id, errMsg);

                        let buttonText = SetupLoader.getBattleReturnButtonText();
                        buttonText = buttonText === "" ? "返回" : _.escape(buttonText);
                        $("#battleMenu").html("" +
                            "<button role='button' class='battleButton' " +
                            "id='battleReturn' style='font-size:150%'>" + buttonText + "</button>" +
                            "")
                            .parent().show();
                        $("#battleReturn").on("click", () => {
                            $("#battleReturn").prop("disabled", true);
                            $("#refreshButton").trigger("click");
                        });
                        $(".battleButton").trigger("click");
                        return;
                    }

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
                                "<button role='button' class='battleButton' " +
                                "id='battleRepair' style='font-size:150%'>" + bt1 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "宿":
                            let bt2 = SetupLoader.getBattleLodgeButtonText();
                            bt2 = bt2 === "" ? "住宿" : _.escape(bt2);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleLodge' style='font-size:150%'>" + bt2 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "存":
                            let bt3 = SetupLoader.getBattleDepositButtonText();
                            bt3 = bt3 === "" ? "存钱" : _.escape(bt3);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleDeposit' style='font-size:150%'>" + bt3 + "</button>" +
                                "")
                                .parent().show();
                            break;
                        case "回":
                            let bt4 = SetupLoader.getBattleReturnButtonText();
                            bt4 = bt4 === "" ? "返回" : _.escape(bt4);
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleReturn' style='font-size:150%'>" + bt4 + "</button>" +
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

function _showReportElement(children: JQuery[], index: number) {
    if (index === children.length) {
        return;
    }
    const child = children[index];
    child.show("fast", "linear", () => {
        _showReportElement(children, index + 1);
    });
}

export = TownDashboardLayout005;