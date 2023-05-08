import StorageUtils from "../../util/StorageUtils";
import MessageBoard from "../../util/MessageBoard";
import SetupLoader from "../../core/SetupLoader";
import SetupItem from "../SetupItem";

class SetupItem015 implements SetupItem {

    render(id?: string): void {
        doRender();
    }

}

const code: string = "015";
const name: string = "战斗的返回台词";
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

    const value = SetupLoader.getBattleReturnButtonText();
    if (value !== "") {
        $("#text_" + code).attr("placeholder", value);
    }

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem();
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<input type='text' id='text_" + code + "' class='text_class_" + code + "' size='40' maxlength='40'>";
    return html;
}

function doSaveSetupItem() {
    const value = $("#text_" + code).val();
    if (value === "") {
        StorageUtils.remove(key);
        MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经重置。");
    } else {
        StorageUtils.set(key, value as string);
        MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    }
    $("#refreshButton").trigger("click");
}

export = SetupItem015;