import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import RoleLoader from "../../pocket/RoleLoader";
import MessageBoard from "../../util/MessageBoard";
import EquipmentLoader from "../../pocket/EquipmentLoader";
import NetworkUtils from "../../util/NetworkUtils";
import Equipment from "../../pocket/Equipment";
import EquipmentParser from "../../pocket/EquipmentParser";
import TreasureBag from "../../pocket/TreasureBag";
import SetupItemManager from "./setup/SetupItemManager";
import Processor from "../Processor";

/**
 * @deprecated
 */
class PersonalSetupProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("给其他人发送消息");
        }
        return false;
    }

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doInitialize(credential);
    }

}

const setupItemManager = new SetupItemManager();

function doInitialize(credential: Credential) {
    // 整个页面是放在一个大form里面，删除重组
    const lastDivHtml = $("div:last").html();
    $("form:first").remove();
    $("body:first").prepend($("<div id='top_container'></div>" +
        "<hr style='height:0;width:100%'>" +
        "<div style='text-align:center'>" + lastDivHtml + "</div>"));

    // 绘制新的页面
    let html = "";
    html += "<div id='eden' style='display:none'>";
    html += "<form action='' method='post' id='eden_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<div style='display:none' id='eden_form_payload'></div>";
    html += "<input type='submit' id='eden_form_submit'>";
    html += "</form>";
    html += "</div>";
    html += "<div id='weapon_list' style='display:none'></div>";
    html += "<div id='armor_list' style='display:none'></div>";
    html += "<div id='accessory_list' style='display:none'></div>";
    $("#top_container").append($(html));

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
        "<input type='button' id='returnButton' value='返回城市界面'>" +
        "</td>";
    html += "</tr>";
    html += "</tody>";
    html += "</table>";
    $("#top_container").append($(html));

    $("#weapon_list").text(EquipmentLoader.loadWeaponList().join(","));
    $("#armor_list").text(EquipmentLoader.loadArmorList().join(","));
    $("#accessory_list").text(EquipmentLoader.loadAccessoryList().join(","));

    doBindLoadButton(credential);
    __bindRefreshButton(credential);
    __bindReturnButton();

    new RoleLoader(credential).load()
        .then(role => {
            MessageBoard.createMessageBoard("message_board_container", role.imageHtml);

            $("#roleImage").on("dblclick", function () {
                // Get setup 001-005 status
                const s1 = $("#select_001").val();
                const s2 = $("#select_002").val();
                const s3 = $("#select_003").val();
                const s4 = $("#select_004").val();
                const s5 = $("#select_005").val();
                if (s1 === "1" &&
                    s2 === "0.2" &&
                    s3 === "20" &&
                    s4 === "20" &&
                    s5 === "2") {
                    if ($("#battle_field_setup").length > 0) {
                        $("#battle_field_setup").toggle();
                    }
                }

                $(".hidden_setup_item").toggle();
            });
        });

    doRender(credential);
}

function doRender(credential: Credential) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0' id='setup_item_table'>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>名字</th>";
    html += "<th style='background-color:#E8E8D0'>专属</th>";
    html += "<th style='background-color:#EFE0C0'>设置</th>";
    html += "<th style='background-color:#E0D0B0'>选择</th>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("#setup_item_container").html(html);

    for (const it of setupItemManager.getSetupItem()) {
        it.render(credential.id);
    }

}

function __bindRefreshButton(credential: Credential) {
    $("#refreshButton").on("click", function () {
        $("#setup_item_table").html("");
        $(".dynamic_button").off("click");
        doRender(credential);
    });
}

function __bindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "status.cgi");
        $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#eden_form_submit").trigger("click");
    });
}

function doBindLoadButton(credential: Credential) {
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
                        doLoadEquipments(equipmentList, bagEquipmentList);
                        $("#refreshButton").trigger("click");
                    });
            } else {
                doLoadEquipments(equipmentList, undefined);
                $("#refreshButton").trigger("click");
            }
        });
    });
}

function doLoadEquipments(itemList: Equipment[], bagItemList?: Equipment[]) {
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

export = PersonalSetupProcessor;