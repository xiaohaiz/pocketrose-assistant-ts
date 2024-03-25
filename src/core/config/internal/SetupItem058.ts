import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem058 implements SetupItem {

    readonly #code = "058";
    readonly #name = "胜利者站在左边";
    readonly #key = "_pa_" + this.#code;

    category(): string {
        return "界面";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += this.#doGenerateSetupItem();
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doGenerateSetupItem() {
        let html = "";
        html += "<input type='button' class='dynamic_button _058_button' id='_058_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _058_button' id='_058_button_2' value='禁用'>";
        return html;
    }

    #doProcessButton() {
        if (SetupLoader.isWinnerLeftEnabled()) {
            $("#_058_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_058_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._058_button").on("click", event => {
            $("._058_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_058_button_1") {
                StorageUtils.set(this.#key, "1");
            } else if (buttonId === "_058_button_2") {
                StorageUtils.set(this.#key, "0");
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem058;