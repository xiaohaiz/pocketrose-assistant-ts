import Equipment from "../../common/Equipment";
import EquipmentLoader from "../../core/EquipmentLoader";
import EquipmentParser from "../../pocket/EquipmentParser";
import RoleLoader from "../../pocket/RoleLoader";
import TreasureBag from "../../pocketrose/TreasureBag";
import SetupItemManager from "../../setup/SetupItemManager";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalSetupPageProcessor extends PageProcessorCredentialSupport {

    readonly #setupItemManager: SetupItemManager;

    constructor() {
        super();
        this.#setupItemManager = new SetupItemManager();
    }

    doProcess(credential: Credential) {
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


        this.#bindLoadButton(credential);
        this.#bindRefreshButton(credential);
        this.doBindReturnButton("returnButton");

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

        this.#render(credential);
    }

    #render(credential: Credential) {
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

        for (const it of this.#setupItemManager.getSetupItem()) {
            it.render(credential.id);
        }

    }

    #bindLoadButton(credential: Credential) {
        const instance = this;
        $("#loadButton").on("click", function () {
            const request = credential.asRequest();
            // @ts-ignore
            request["mode"] = "USE_ITEM";
            NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                const equipmentList = EquipmentParser.parsePersonalItemList(html);
                const treasureBag = EquipmentParser.findTreasureBag(equipmentList);
                if (treasureBag !== null) {
                    new TreasureBag(credential).open(treasureBag.index!)
                        .then(bagPage => {
                            const bagEquipmentList = bagPage.equipmentList!;
                            instance.#loadEquipments(equipmentList, bagEquipmentList);
                            $("#refreshButton").trigger("click");
                        });
                } else {
                    instance.#loadEquipments(equipmentList, undefined);
                    $("#refreshButton").trigger("click");
                }
            });
        });
    }

    #bindRefreshButton(credential: Credential) {
        const instance = this;
        $("#refreshButton").on("click", function () {
            $("#setup_item_table").html("");
            $(".dynamic_button").off("click");
            instance.#render(credential);
        });
    }

    #loadEquipments(itemList: Equipment[], bagItemList?: Equipment[]) {
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

    abstract doGenerateHiddenForm(credential: Credential, containerId: string): void;

    abstract doBindReturnButton(returnButtonId: string): void;
}

export = AbstractPersonalSetupPageProcessor;