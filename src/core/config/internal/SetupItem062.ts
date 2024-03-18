import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem062 implements SetupItem {

    readonly #code: string = "062";
    readonly #name: string = "隐藏快捷键提示";
    readonly #key: string = "_pa_" + this.#code;

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        this.#doRender(id!);
    }

    #doRender(id: string) {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='button' class='dynamic_button _062_button' id='_062_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _062_button' id='_062_button_2' value='禁用'>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>";
        html += "主打就是一个脑子好，记得住。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton(id);
    }

    #doProcessButton(id: string) {
        const value = SetupLoader.isShortcutPromptHidden(id);
        $("._062_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._062_button").on("click", event => {
            $("._062_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_062_button_1") {
                StorageUtils.set(this.#key + "_" + id, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_062_button_2") {
                StorageUtils.set(this.#key + "_" + id, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用！");
            }
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem062;