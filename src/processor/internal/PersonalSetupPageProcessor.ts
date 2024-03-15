import ConfigManager from "../../core/config/ConfigManager";
import SetupItemManager from "../../core/config/SetupItemManager";
import Equipment from "../../core/equipment/Equipment";
import EquipmentLoader from "../../core/equipment/EquipmentLoader";
import PersonalEquipmentManagement from "../../core/equipment/PersonalEquipmentManagement";
import TreasureBag from "../../core/equipment/TreasureBag";
import PersonalStatus from "../../core/role/PersonalStatus";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalSetupPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062,
            10132];
    }

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
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
        html += "<td id='pageTitle' style='background-color:navy;color:yellowgreen;font-size:150%;font-weight:bold'>" +
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

        html += "<tr>";
        html += "<td style='text-align:center;background-color:red;font-weight:bold;font-size:120%'>" +
            "以下操作包含有账号登陆敏感信息，请自己保护好数据安全！" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='text-align:center'>" +
            "<input type='button' id='exportButton' value='导出所有设置'>" +
            "<input type='button' id='importButton' value='导入所有设置'>" +
            "<input type='button' id='purgeButton' value='清除所有设置'>" +
            "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='text-align:center'>";
        // noinspection CssInvalidPropertyValue
        html += "<textarea id='allConfigs' " +
            "rows='15' " +
            "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
            "</textarea>";
        html += "</td>";
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

        $("#exportButton").on("click", () => {
            const allConfigs = ConfigManager.exportAsJson();
            $("#allConfigs").val(allConfigs);
        });
        $("#importButton").on("click", () => {
            if (!confirm("请确认要导入助手的所有设置？")) {
                return;
            }
            const json = $("#allConfigs").val() as string;
            ConfigManager.importFromJson(json);
            MessageBoard.publishMessage("助手设置信息已经导入！");
            PageUtils.scrollIntoView("pageTitle");
            $("#refreshButton").trigger("click");

        });
        $("#purgeButton").on("click", () => {
            if (!confirm("请再次确认要清除助手的所有设置？")) {
                return;
            }
            ConfigManager.purge();
            MessageBoard.publishMessage("所有助手设置信息已经清除！");
            PageUtils.scrollIntoView("pageTitle");
            $("#refreshButton").trigger("click");
        });

        new PersonalStatus(credential).load().then(role => {
            MessageBoard.createMessageBoard("message_board_container", role.imageHtml);
        });

        this.#render(credential);

        new KeyboardShortcutBuilder()
            .onKeyPressed("r", () => {
                MessageBoard.resetMessageBoard("口袋助手设置已经重新加载。");
                $("#refreshButton").trigger("click");
            })
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #render(credential: Credential) {
        let html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0' id='setup_item_table'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>名字</th>";
        html += "<th>专属</th>";
        html += "<th>设置</th>";
        html += "<th>选择</th>";
        html += "<th>说明</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#setup_item_container").html(html);

        for (const it of SetupItemManager.getInstance().getSetupItem()) {
            it.render(credential.id);
        }
    }

    #bindLoadButton(credential: Credential) {
        const instance = this;
        $("#loadButton").on("click", function () {
            new PersonalEquipmentManagement(credential).open().then(page => {
                const equipmentList = page.equipmentList!;
                const treasureBag = page.findTreasureBag();
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
            $(".dynamic_button").off("click");
            $(".dynamic_select").off("change");
            $("#setup_item_table").html("");
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

export = PersonalSetupPageProcessor;