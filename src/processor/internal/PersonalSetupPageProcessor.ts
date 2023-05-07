import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import SetupItemManager from "../personal/setup/SetupItemManager";
import EquipmentLoader from "../../pocket/EquipmentLoader";
import Equipment from "../../pocket/Equipment";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import TreasureBag from "../../pocket/TreasureBag";

abstract class PersonalSetupPageProcessor implements PageProcessor {

    readonly #setupItemManager: SetupItemManager;

    constructor() {
        this.#setupItemManager = new SetupItemManager();
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();

        // 整个页面是放在一个大form里面，删除重组
        const lastDivHtml = $("div:last").html();
        $("form:first").remove();
        $("body:first").prepend($("<div id='top_container'></div>" +
            "<hr style='height:0;width:100%'>" +
            "<div style='text-align:center'>" + lastDivHtml + "</div>"));

        // 绘制新的页面
        let html = "";
        html += "<div id='hiddenFormContainer' style='display:none'></div>";
        html += "<div id='weapon_list' style='display:none'></div>";
        html += "<div id='armor_list' style='display:none'></div>";
        html += "<div id='accessory_list' style='display:none'></div>";
        $("#top_container").append($(html));

        this.doGenerateHiddenForm(credential, "hiddenFormContainer");

        html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td style='background-color:navy;color:yellowgreen;font-size:150%;font-weight:bold'>" +
            "＜＜  口 袋 助 手 设 置  ＞＞" +
            "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='message_board_container'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='setup_item_container'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:center'>" +
            "<input type='button' id='loadButton' value='加载自己装备'>" +
            "<input type='button' id='refreshButton' value='刷新助手设置'>" +
            "<input type='button' id='returnButton' value='退出助手设置'>" +
            "</td>";
        html += "</tr>";
        html += "</tody>";
        html += "</table>";
        $("#top_container").append($(html));

        $("#weapon_list").text(EquipmentLoader.loadWeaponList().join(","));
        $("#armor_list").text(EquipmentLoader.loadArmorList().join(","));
        $("#accessory_list").text(EquipmentLoader.loadAccessoryList().join(","));


        _bindLoadButton(credential);
        this.doBindReturnButton("returnButton");
    }

    abstract doGenerateHiddenForm(credential: Credential, containerId: string): void;

    abstract doBindReturnButton(returnButtonId: string): void;
}

function _bindLoadButton(credential: Credential) {
    $("#loadButton").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["mode"] = "USE_ITEM";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            const equipmentList = EquipmentParser.parsePersonalItemList(html);
            const treasureBag = EquipmentParser.findTreasureBag(equipmentList);
            if (treasureBag !== null) {
                new TreasureBag(credential, treasureBag.index!).open()
                    .then(bagEquipmentList => {
                        _loadEquipments(equipmentList, bagEquipmentList);
                        $("#refreshButton").trigger("click");
                    });
            } else {
                _loadEquipments(equipmentList, undefined);
                $("#refreshButton").trigger("click");
            }
        });
    });
}

function _loadEquipments(itemList: Equipment[], bagItemList?: Equipment[]) {
    const weaponLib = [];
    const armorLib = [];
    const accessoryLib = [];

    for (const it of itemList) {
        if (it.isWeapon) {
            weaponLib.push(it.name);
        }
        if (it.isArmor) {
            armorLib.push(it.name);
        }
        if (it.isAccessory) {
            accessoryLib.push(it.name);
        }
    }
    if (bagItemList !== undefined) {
        for (const it of bagItemList) {
            if (it.isWeapon) {
                weaponLib.push(it.name);
            }
            if (it.isArmor) {
                armorLib.push(it.name);
            }
            if (it.isAccessory) {
                accessoryLib.push(it.name);
            }
        }
    }

    const weaponCandidates = [];
    const armorCandidates = [];
    const accessoryCandidates = [];

    for (const it of EquipmentLoader.loadWeaponList()) {
        if (weaponLib.includes(it)) {
            weaponCandidates.push(it);
        }
    }
    for (const it of EquipmentLoader.loadArmorList()) {
        if (armorLib.includes(it)) {
            armorCandidates.push(it);
        }
    }
    for (const it of EquipmentLoader.loadAccessoryList()) {
        if (accessoryLib.includes(it)) {
            accessoryCandidates.push(it);
        }
    }

    $("#weapon_list").text(weaponCandidates.join(","));
    $("#armor_list").text(armorCandidates.join(","));
    $("#accessory_list").text(accessoryCandidates.join(","));
}

export = PersonalSetupPageProcessor;