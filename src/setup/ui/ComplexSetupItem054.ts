import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";
import {SetupStorage} from "../SetupStorage";

class ComplexSetupItem054 implements SetupItem {

    category(): string {
        return "界面";
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

const code: string = "054";
const name: string = "界面主按钮样式";
const key: string = "_pa_" + code;

function doRender() {
    let t = "";
    t += "<table style='border-width:0;background-color:transparent;margin:auto'>";
    t += "</tbody>";
    t += "<tr>";
    t += "<td style='text-align: left'>" + doGenerateSetupItem() + "</td>";
    t += "<td style='width:64px;background-color:#888888' id='sample-054'></td>";
    t += "<td style='width:100%'></td>"
    t += "</tr>";
    t += "</tbody>";
    t += "</table>";

    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + code + "'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='重置'></td>";
    html += "<td style='background-color:#F8F0E0;text-align:left'>" + t + "</td>";
    html += "<td style='background-color:#F8F0E0;text-align:left'>";
    html += "为城市和城堡界面主按钮选个样式，看着顺眼战斗也舒心。";
    html += "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    $(".select-054").on("change", event => {
        const currentSelect = parseInt($(event.target).val() as string);
        SetupStorage.store(key, currentSelect.toString());
        doGenerateButtonSample(currentSelect);
    });

    const value = SetupLoader.getTownDashboardMainButton();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);
    doGenerateButtonSample(value);

    $("#setup_" + code).on("click", () => {
        SetupStorage.remove(key);
        $("#refreshSetupButton").trigger("click");
    });
}

function doGenerateButtonSample(index: number) {
    const td = $("#sample-054");
    if (index === 0) {
        const button: string = "<button role='button'>SAMPLE</button>";
        td.html(button);
        return;
    }

    const button: string = "<button role='button' class='button-" + index + "'>SAMPLE</button>";
    td.html(button);
}

function doGenerateSetupItem() {
    let html = "";
    html += "<select id='select_" + code + "' class='dynamic_select select-054'>";
    html += "<option class='option_class_" + code + "' value='0'>默认按钮</option>";
    html += "<option class='option_class_" + code + "' value='10005'>样式一</option>";
    html += "<option class='option_class_" + code + "' value='10007'>样式二</option>";
    html += "<option class='option_class_" + code + "' value='10008'>样式三</option>";
    html += "<option class='option_class_" + code + "' value='10016'>样式四</option>";
    html += "<option class='option_class_" + code + "' value='10024'>样式五</option>";
    html += "<option class='option_class_" + code + "' value='10028'>样式六</option>";
    html += "<option class='option_class_" + code + "' value='10032'>样式七</option>";
    html += "<option class='option_class_" + code + "' value='10033'>样式八</option>";
    html += "<option class='option_class_" + code + "' value='10035'>样式九</option>";
    html += "<option class='option_class_" + code + "' value='10062'>样式十</option>";
    html += "<option class='option_class_" + code + "' value='10132'>样式十一</option>";
    html += "</select>";
    return html;
}

export = ComplexSetupItem054;