import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import BattleFieldConfigLoader from "../../battle/BattleFieldConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem056 implements SetupItem {

    category(): string {
        return "战斗";
    }

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
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + code + "'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const config = BattleFieldConfigLoader.loadGlobalConfig();
    $("#primary_battle_global").prop("checked", config.primary);
    $("#junior_battle_global").prop("checked", config.junior);
    $("#senior_battle_global").prop("checked", config.senior);
    $("#zodiac_battle_global").prop("checked", config.zodiac);

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