import MessageBoard from "../../util/MessageBoard";
import StorageUtils from "../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem050 implements SetupItem {

    render(id?: string): void {
        doRender();
    }

}

const code: string = "050";
const name: string = "扩展的快捷按钮";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = SetupLoader.getTownDashboardExtensionShortcutButton();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='0'>禁用</option>";
    html += "<option class='option_class_" + code + "' value='1'>使用手册</option>";
    html += "<option class='option_class_" + code + "' value='2'>口袋驿站</option>";
    html += "<option class='option_class_" + code + "' value='3'>武器商店</option>";
    html += "<option class='option_class_" + code + "' value='4'>防具商店</option>";
    html += "<option class='option_class_" + code + "' value='5'>饰品商店</option>";
    html += "<option class='option_class_" + code + "' value='6'>物品商店</option>";
    html += "<option class='option_class_" + code + "' value='7'>宝石镶嵌</option>";
    html += "<option class='option_class_" + code + "' value='8'>冒险公会</option>";
    html += "<option class='option_class_" + code + "' value='9'>快速登陆</option>";
    html += "<option class='option_class_" + code + "' value='10'>宠物联赛</option>";
    html += "<option class='option_class_" + code + "' value='11'>宠物排行</option>";
    html += "<option class='option_class_" + code + "' value='12'>城市收益</option>";
    html += "<option class='option_class_" + code + "' value='13'>养精蓄锐</option>";
    html += "<option class='option_class_" + code + "' value='14'>团队统计</option>";
    html += "</select>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    StorageUtils.set(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem050;