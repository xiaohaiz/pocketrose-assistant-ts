import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem076 implements SetupItem {

    readonly #code = "076";
    readonly #name = "规避数字验证码";
    readonly #key = "_pa_" + this.#code;

    category(): string {
        return "其他";
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
        html += "<input type='button' class='dynamic_button _076_button' id='_076_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _076_button' id='_076_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        if (SetupLoader.isAvoidDigitalValidationCodeEnabled()) {
            $("#_076_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_076_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._076_button").on("click", event => {
            $("._076_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_076_button_1") {
                StorageUtils.set(this.#key, "1");
            } else if (buttonId === "_076_button_2") {
                StorageUtils.set(this.#key, "0");
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export {SetupItem076};