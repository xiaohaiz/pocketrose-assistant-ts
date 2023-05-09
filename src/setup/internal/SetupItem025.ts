import StorageUtils from "../../util/StorageUtils";
import MessageBoard from "../../util/MessageBoard";
import SetupLoader from "../../core/SetupLoader";
import SetupItem from "../SetupItem";
import NpcLoader from "../../core/NpcLoader";

class SetupItem025 implements SetupItem {

    render(id?: string): void {
        doRender();
    }

}

const code: string = "025";
const name: string = "正常战斗的提示";
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

    const value = SetupLoader.getNormalBattlePrompt();
    $(".option_class_" + code + "[value='" + value["person"] + "']").prop("selected", true);
    $("#text_" + code).attr("placeholder", value["text"]);

    $("#setup_" + code).on("click", function () {
        doSaveSetupItem(value["text"]);
    });
}

function doGenerateSetupItem() {
    let html = "";
    html += "<select id='select_" + code + "'>";
    html += "<option class='option_class_" + code + "' value='NONE'>禁用</option>";
    html += "<option class='option_class_" + code + "' value='SELF'>自己</option>";
    html += "<option class='option_class_" + code + "' value='RANDOM'>随机</option>";
    for (const name of NpcLoader.playerNpcNames()) {
        html += "<option class='option_class_" + code + "' value='" + name + "'>" + name + "</option>";
    }
    html += "</select>";
    html += "<input type='text' id='text_" + code + "' size='60' maxlength='60' placeholder='自定义台词'>";
    return html;
}

function doSaveSetupItem(beforeText: string) {
    let person = $("#select_" + code).val();
    let text = $("#text_" + code).val();
    if (text === undefined || text === null || (text as string).trim() === "") {
        text = beforeText;
    }
    if (person === "NONE") {
        text = "";
    }
    const value = {};
    // @ts-ignore
    value["person"] = person;
    // @ts-ignore
    value["text"] = text;

    StorageUtils.set(key, JSON.stringify(value));
    MessageBoard.publishMessage("<b style='color:red'>" + name + "</b>已经设置。");
    $("#refreshButton").trigger("click");
}

export = SetupItem025;