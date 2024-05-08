import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem074 implements SetupItem {

    readonly #code = "074";
    readonly #name = "传统的战斗模式";
    readonly #key = "_pa_" + this.#code;

    category(): string {
        return "战斗";
    }

    code(): string {
        return this.#code;
    }

    accept(id?: string): boolean {
        return true;
    }

    render(id?: string): void {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<input type='button' class='dynamic_button _074_button' id='_074_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _074_button' id='_074_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        if (SetupLoader.isTraditionalBattleModeEnabled()) {
            $("#_074_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_074_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._074_button").on("click", event => {
            $("._074_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_074_button_1") {
                StorageUtils.set(this.#key, "1");
            } else if (buttonId === "_074_button_2") {
                StorageUtils.set(this.#key, "0");
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export {SetupItem074};