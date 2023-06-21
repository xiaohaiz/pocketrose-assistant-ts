import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import BattleFieldConfigLoader from "../BattleFieldConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem056 implements SetupItem {

    code(): string {
        return code;
    }

    render(id?: string): void {
        doRender();
    }

}

const code: string = "056";
const name: string = "全局战斗场偏好";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr class='battle_field_setup' style='display:none'>";
    html += "<th style='background-color:red;color:wheat'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    let value = BattleFieldConfigLoader.loadGlobalConfig();
    // @ts-ignore
    $("#primary_battle_global").prop("checked", value["primary"]);
    // @ts-ignore
    $("#junior_battle_global").prop("checked", value["junior"]);
    // @ts-ignore
    $("#senior_battle_global").prop("checked", value["senior"]);
    // @ts-ignore
    $("#zodiac_battle_global").prop("checked", value["zodiac"]);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='primary_battle_global'>初级之森";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='junior_battle_global'>中级之塔";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='senior_battle_global'>上级之洞";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='zodiac_battle_global'>十二神殿";
    html += " <span style='color:blue'>全局设置优先级高于专属设置</span>";
    return html;
}

function doSaveSetupItem() {
    const value = {};
    // @ts-ignore
    value["primary"] = $("#primary_battle_global").prop("checked");
    // @ts-ignore
    value["junior"] = $("#junior_battle_global").prop("checked");
    // @ts-ignore
    value["senior"] = $("#senior_battle_global").prop("checked");
    // @ts-ignore
    value["zodiac"] = $("#zodiac_battle_global").prop("checked");

    StorageUtils.set(key, JSON.stringify(value));
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem056;