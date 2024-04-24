import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem054 implements SetupItem {

    category(): string {
        return "界面";
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

const code: string = "054";
const name: string = "城市主按钮样式";
const key: string = "_pa_" + code;

function doRender() {
    let t = "";
    t += "<table style='border-width:0;background-color:transparent;margin:auto'>";
    t += "</tbody>";
    t += "<tr>";
    t += "<td style='text-align: left'>" + doGenerateSetupItem() + "</td>";
    t += "<td style='width:64px' id='sample-054'></td>";
    t += "<td style='width:100%'></td>"
    t += "</tr>";
    t += "</tbody>";
    t += "</table>";

    let html = "";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + code + "'>" + name + "</th>";
    html += "<td style='background-color:#E8E8D0'></td>";
    html += "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" + code + "' value='设置'></td>";
    html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + t + "</td>";
    html += "</tr>";

    $("#setup_item_table").append($(html));

    $(".select-054").on("change", event => {
        const currentSelect = parseInt($(event.target).val() as string);
        doGenerateButtonSample(currentSelect);
    });

    const value = SetupLoader.getTownDashboardMainButton();
    $(".option_class_" + code + "[value='" + Number(value) + "']").prop("selected", true);
    doGenerateButtonSample(value);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateButtonSample(index: number) {
    if (index === 0) {
        const button: string = "<button role='button'>SAMPLE</button>";
        $("#sample-054").html(button);
        return;
    }

    const button: string = "<button role='button' class='button-" + index + "'>SAMPLE</button>";
    $("#sample-054").html(button);
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

function doSaveSetupItem() {
    const value = $("#select_" + code).val();
    StorageUtils.set(key, value!.toString());
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem054;