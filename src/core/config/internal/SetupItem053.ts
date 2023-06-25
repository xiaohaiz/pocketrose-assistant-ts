import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import LayoutConfigLoader from "../../dashboard/LayoutConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem053 implements SetupItem {

    code(): string {
        return code;
    }

    render(id?: string): void {
        doRender(id!);
    }

}

const code: string = "053";
const name: string = "面板的专属布局";
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

    const value = StorageUtils.getInt(key + "_" + id, 0);
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem(id);
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='0'>跟随全局设置</option>";
    LayoutConfigLoader.loadAll().forEach(config => {
        html += "<option class='option_class_" + code + "' value='" + config.id + "'>" + config.name + "</option>";
    });
    html += "</select>";
    return html;
}

function doSaveSetupItem(id: string) {
    const value = $("#select_" + code).val();
    StorageUtils.set(key + "_" + id, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem053;