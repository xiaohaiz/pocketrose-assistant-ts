import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import LayoutConfigLoader from "../../dashboard/LayoutConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem052 implements SetupItem {

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

const code: string = "052";
const name: string = "城市面板的布局";
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

    const value = StorageUtils.getFloat("_pa_052", 1);
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    LayoutConfigLoader.loadAll().forEach(config => {
        html += "<option class='option_class_" + code + "' value='" + config.id + "'>" + config.name + "</option>";
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

export = SetupItem052;