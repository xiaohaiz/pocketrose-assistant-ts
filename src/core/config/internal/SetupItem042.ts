import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem042 implements SetupItem {

    render(id?: string): void {
        doRender();
    }

}

const code: string = "042";
const name: string = "登陆页面的布局";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = SetupLoader.getLoginPageLayout();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='0'>居中</option>";
    html += "<option class='option_class_" + code + "' value='1'>靠上</option>";
    html += "<option class='option_class_" + code + "' value='2'>靠下</option>";
    html += "<option class='option_class_" + code + "' value='3'>靠左</option>";
    html += "<option class='option_class_" + code + "' value='4'>靠右</option>";
    html += "<option class='option_class_" + code + "' value='5'>左上</option>";
    html += "<option class='option_class_" + code + "' value='6'>左下</option>";
    html += "<option class='option_class_" + code + "' value='7'>右上</option>";
    html += "<option class='option_class_" + code + "' value='8'>右下</option>";
    html += "</select>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    StorageUtils.set(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem042;