import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import BattleFieldConfigLoader from "../../battle/BattleFieldConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem012 implements SetupItem {

    category(): string {
        return "战斗";
    }

    code(): string {
        return code;
    }

    render(id?: string): void {
        doRender(id!);
    }

}

const code: string = "012";
const name: string = "战斗场偏好设置";
const key: string = "_pa_" + code;

function doRender(id: string) {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'>★</td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const config = BattleFieldConfigLoader.loadCustomizedConfig(id);
    $("#primary_battle").prop("checked", config.primary);
    $("#junior_battle").prop("checked", config.junior);
    $("#senior_battle").prop("checked", config.senior);
    $("#zodiac_battle").prop("checked", config.zodiac);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem(id);
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='primary_battle'>初级之森";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='junior_battle'>中级之塔";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='senior_battle'>上级之洞";
    html += "<input type='checkbox' class='checkbox_class_" + code + "' id='zodiac_battle'>十二神殿";
    return html;
}

function doSaveSetupItem(id: string) {
    const value = {};
    // @ts-ignore
    value["primary"] = $("#primary_battle").prop("checked");
    // @ts-ignore
    value["junior"] = $("#junior_battle").prop("checked");
    // @ts-ignore
    value["senior"] = $("#senior_battle").prop("checked");
    // @ts-ignore
    value["zodiac"] = $("#zodiac_battle").prop("checked");

    StorageUtils.set(key + "_" + id, JSON.stringify(value));
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem012;