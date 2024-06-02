import MessageBoard from "../../util/MessageBoard";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";
import {SetupStorage} from "../SetupStorage";

class ComplexSetupItem002 implements SetupItem {

    category(): string {
        return "战斗";
    }

    code(): string {
        return code;
    }

    accept(): boolean {
        return true;
    }

    render(): void {
        doRender();
    }

}

const code: string = "002";
const name: string = "掉血后自动住宿";
const key: string = "_pa_" + code;

function doRender() {
    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + code + "'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='重置'></td>";
    html += "<td style='background-color:#F8F0E0;text-align:left' colspan='2'>" + doGenerateSetupItem() + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    const value = SetupLoader.getLodgeHealthLostRatio();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);

    $("#select_" + code).on("change", () => {
        const value = $("#select_" + code).val();
        SetupStorage.store(key, value!.toString());
        MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    });

    $("#setup_" + code).on("click", function () {
        SetupStorage.remove(key);
        $("#refreshSetupButton").trigger("click");
    });
}

function doGenerateSetupItem() {
    let html = "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='-1'>禁用</option>";
    html += "<option class='option_class_" + code + "' value='0.1'>10%</option>";
    html += "<option class='option_class_" + code + "' value='0.2'>20%</option>";
    html += "<option class='option_class_" + code + "' value='0.3'>30%</option>";
    html += "<option class='option_class_" + code + "' value='0.4'>40%</option>";
    html += "<option class='option_class_" + code + "' value='0.5'>50%</option>";
    html += "<option class='option_class_" + code + "' value='0.6'>60%</option>";
    html += "<option class='option_class_" + code + "' value='0.7'>70%</option>";
    html += "<option class='option_class_" + code + "' value='0.8'>80%</option>";
    html += "<option class='option_class_" + code + "' value='0.9'>90%</option>";
    html += "</select>";
    return html;
}

export = ComplexSetupItem002;