import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem057 implements SetupItem {

    category(): string {
        return "界面";
    }

    code(): string {
        return code;
    }

    render(id?: string): void {
        doRender();
    }

}

const code: string = "057";
const name: string = "上班悄悄的摸鱼";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + code + "'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left'>" + doGenerateSetupItem() + "</td>";
    html += "<td style='background-color:#E8E8D0;text-align:left'>战斗布局专属设置，简化战斗报告的显示，防止你的领导和同事围观。</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = SetupLoader.isQuietBattleModeEnabled();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='1'>启用</option>";
    html += "<option class='option_class_" + code + "' value='0'>禁用</option>";
    html += "</select>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    StorageUtils.set(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem057;