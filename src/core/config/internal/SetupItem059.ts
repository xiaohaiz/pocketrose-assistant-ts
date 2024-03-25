import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem059 implements SetupItem {

    readonly #code: string = "059";
    readonly #name: string = "智能选择战斗场";
    readonly #key: string = "_pa_059";

    category(): string {
        return "战斗";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        this.#doRender();
    }

    #doRender() {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<input type='button' class='dynamic_button _059_button' id='_059_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _059_button' id='_059_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        const value = SetupLoader.isAutoSetBattleFieldEnabled();
        $("._059_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._059_button").on("click", event => {
            $("._059_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_059_button_1") {
                StorageUtils.set(this.#key, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_059_button_2") {
                StorageUtils.set(this.#key, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用!");
            }
            $("#refreshButton").trigger("click");
        });
    }
}

export = SetupItem059;