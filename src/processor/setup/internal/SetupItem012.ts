import StorageUtils from "../../../util/StorageUtils";
import MessageUtils from "../../../util/MessageUtils";
import SetupLoader from "../../../pocket/SetupLoader";

class SetupItem012 implements SetupItem {

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
    html += "<td style='background-color:#E0D0B0;text-align:left'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = SetupLoader.getBattlePlacePreference(id);
    // @ts-ignore
    $("#primary_battle").prop("checked", value["primary"]);
    // @ts-ignore
    $("#junior_battle").prop("checked", value["junior"]);
    // @ts-ignore
    $("#senior_battle").prop("checked", value["senior"]);
    // @ts-ignore
    $("#zodiac_battle").prop("checked", value["zodiac"]);

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
    MessageUtils.publishMessageBoard("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem012;