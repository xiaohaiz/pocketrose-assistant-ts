import StorageUtils from "../../../util/StorageUtils";
import MessageBoard from "../../../util/MessageBoard";
import SetupLoader from "../../../pocket/SetupLoader";

class SetupItem005 implements SetupItem {

    render(id?: string): void {
        doRender();
    }

}

const code: string = "005";
const name: string = "触发存钱的战数";
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

    const value = SetupLoader.getDepositBattleCount();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='-1'>不存</option>";
    html += "<option class='option_class_" + code + "' value='0'>每战存钱</option>";
    html += "<option class='option_class_" + code + "' value='2'>2战一存</option>";
    html += "<option class='option_class_" + code + "' value='5'>5战一存</option>";
    html += "<option class='option_class_" + code + "' value='10'>10战一存</option>";
    html += "</select>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    StorageUtils.set(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem005;