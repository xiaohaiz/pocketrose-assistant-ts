import StorageUtils from "../../../util/StorageUtils";
import MessageBoard from "../../../util/MessageBoard";
import SetupLoader from "../../../pocket/SetupLoader";

class SetupItem022 implements SetupItem {

    render(id?: string): void {
        doRender(id!);
    }

}

const code: string = "022";
const name: string = "自定义的套装Ｄ";
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

    const value = SetupLoader.loadEquipmentSet_D(id);
    if (value["weaponStar"] !== undefined && value["weaponStar"]) {
        $(".checkbox_" + code + "[value='weaponStar']").prop("checked", true);
    }
    if (value["armorStar"] !== undefined && value["armorStar"]) {
        $(".checkbox_" + code + "[value='armorStar']").prop("checked", true);
    }
    if (value["accessoryStar"] !== undefined && value["accessoryStar"]) {
        $(".checkbox_" + code + "[value='accessoryStar']").prop("checked", true);
    }
    $(".weapon_option_" + code + "[value='" + value["weaponName"] + "']").prop("selected", true);
    $(".armor_option_" + code + "[value='" + value["armorName"] + "']").prop("selected", true);
    $(".accessory_option_" + code + "[value='" + value["accessoryName"] + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem(id);
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<input type='checkbox' name='star_" + code + "' class='checkbox_" + code + "' value='weaponStar'>★";
    const weaponList = $("#weapon_list").text().split(",");
    html += "<select name='weapon_" + code + "'>";
    html += "<option class='weapon_option_" + code + "' value='NONE'>无</option>";
    for (const it of weaponList) {
        html += "<option class='weapon_option_" + code + "' value='" + it + "'>" + it + "</option>";
    }
    html += "</select>";
    html += "<input type='checkbox' name='star_" + code + "' class='checkbox_" + code + "' value='armorStar'>★";
    const armorList = $("#armor_list").text().split(",");
    html += "<select name='armor_" + code + "'>";
    html += "<option class='armor_option_" + code + "' value='NONE'>无</option>";
    for (const it of armorList) {
        html += "<option class='armor_option_" + code + "' value='" + it + "'>" + it + "</option>";
    }
    html += "</select>";
    html += "<input type='checkbox' name='star_" + code + "' class='checkbox_" + code + "' value='accessoryStar'>★";
    const accessoryList = $("#accessory_list").text().split(",");
    html += "<select name='accessory_" + code + "'>";
    html += "<option class='accessory_option_" + code + "' value='NONE'>无</option>";
    for (const it of accessoryList) {
        html += "<option class='accessory_option_" + code + "' value='" + it + "'>" + it + "</option>";
    }
    html += "</select>";
    return html;
}

function doSaveSetupItem(id: string) {
    const value = {};
    $("input:checkbox[name='star_" + code + "']:checked").each(function (_idx, checkbox) {
        // @ts-ignore
        value[$(checkbox).val()] = true;
    });
    // @ts-ignore
    value["weaponName"] = $("select[name='weapon_" + code + "']").val();
    // @ts-ignore
    value["armorName"] = $("select[name='armor_" + code + "']").val();
    // @ts-ignore
    value["accessoryName"] = $("select[name='accessory_" + code + "']").val();

    // @ts-ignore
    if (value["weaponName"] === "NONE") {
        // @ts-ignore
        value["weaponStar"] = false;
    }
    // @ts-ignore
    if (value["armorName"] === "NONE") {
        // @ts-ignore
        value["armorStar"] = false;
    }
    // @ts-ignore
    if (value["accessoryName"] === "NONE") {
        // @ts-ignore
        value["accessoryStar"] = false;
    }

    StorageUtils.set(key + "_" + id, JSON.stringify(value));
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem022;