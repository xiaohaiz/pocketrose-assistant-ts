import _ from "lodash";
import SetupLoader from "../config/SetupLoader";
import BattleProcessor from "../core/battle/BattleProcessor";
import BattleRecord from "../core/battle/BattleRecord";
import BattleStorageManager from "../core/battle/BattleStorageManager";
import EquipmentLocalStorage from "../core/EquipmentLocalStorage";
import PetLocalStorage from "../core/PetLocalStorage";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StorageUtils from "../util/StorageUtils";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout003 from "./TownDashboardLayout003";

class TownDashboardLayout006 extends TownDashboardLayout {

    readonly #layout003: TownDashboardLayout = new TownDashboardLayout003();

    id(): number {
        return 6;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        this.#layout003.render(credential, page);

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

        BattleStorageManager.getBattleRecordStorage().load(credential.id).then(record => {
            const lastBattle = record.html!;
            if (lastBattle.includes("吐故纳新，扶摇直上")) {
                $("#battlePanel").css("background-color", "wheat");
            }
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
                $("#battlePanel").html(lastBattle);
            }
        });


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

                        const record = new BattleRecord();
                        record.id = credential.id;
                        record.html = errMsg;
                        BattleStorageManager.getBattleRecordStorage().write(record).then();

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

                    const currentBattleCount = battleCount + 1;

                    const processor = new BattleProcessor(credential, html, currentBattleCount);
                    processor.doProcess();

                    $("#battlePanel").html(processor.obtainPage!.reportHtml!);

                    const recommendation = processor.obtainRecommendation;
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

function _showReportElement(children: JQuery[], index: number) {
    if (index === children.length) {
        return;
    }
    const child = children[index];
    child.show("fast", "linear", () => {
        _showReportElement(children, index + 1);
    });
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