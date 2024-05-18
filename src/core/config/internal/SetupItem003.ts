import MessageBoard from "../../../util/MessageBoard";
import SetupItem from "../../../setup/SetupItem";
import SetupLoader from "../../../setup/SetupLoader";
import {SetupStorage} from "../../../setup/SetupStorage";

class SetupItem003 implements SetupItem {

    category(): string {
        return "战斗";
    }

    code(): string {
        return code;
    }

    accept(id?: string): boolean {
        return true;
    }

    render(id?: string): void {
        doRender();
    }

}

const code: string = "003";
const name: string = "掉魔后自动住宿";
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

    const value = SetupLoader.getLodgeManaLostPoint();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='-1'>禁用</option>";
    html += "<option class='option_class_" + code + "' value='10'>10PP</option>";
    html += "<option class='option_class_" + code + "' value='20'>20PP</option>";
    html += "<option class='option_class_" + code + "' value='50'>50PP</option>";
    html += "<option class='option_class_" + code + "' value='100'>100PP</option>";
    html += "<option class='option_class_" + code + "' value='200'>200PP</option>";
    html += "<option class='option_class_" + code + "' value='500'>500PP</option>";
    html += "</select>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    SetupStorage.store(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem003;