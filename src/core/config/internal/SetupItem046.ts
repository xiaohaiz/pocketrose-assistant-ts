import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";

class SetupItem046 implements SetupItem {

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

const code: string = "046";
const name: string = "战斗后隐藏按钮";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left'>" + doGenerateSetupItem() + "</td>";
    html += "<td style='background-color:#E8E8D0;text-align:left'>战斗布局专属设置，点击战斗后自动隐藏更新和战斗按钮，战斗完成会自动恢复。</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = StorageUtils.getBoolean(key);
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

export = SetupItem046;