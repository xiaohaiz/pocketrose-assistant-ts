import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import ExtensionShortcutLoader from "../../dashboard/ExtensionShortcutLoader";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem050 implements SetupItem {

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

const code: string = "050";
const name: string = "扩展的快捷按钮";
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

    const value = SetupLoader.getTownDashboardExtensionShortcutButton();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='0'>禁用</option>";
    ExtensionShortcutLoader.listAll().forEach(it => {
        // @ts-ignore
        const name = it[0];
        // @ts-ignore
        const value = it[1];
        html += "<option class='option_class_" + code + "' value='" + value + "'>" + name + "</option>";
    });
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