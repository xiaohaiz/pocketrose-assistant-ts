import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem077 implements SetupItem {

    readonly #code = "077";
    readonly #name = "警示验证码错误";
    readonly #key = "_pa_" + this.#code;

    category(): string {
        return "界面";
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
        html += "<input type='button' class='dynamic_button _077_button' id='_077_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _077_button' id='_077_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        if (SetupLoader.isWarningValidationFailureEnabled()) {
            $("#_077_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_077_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._077_button").on("click", event => {
            $("._077_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_077_button_1") {
                StorageUtils.set(this.#key, "1");
            } else if (buttonId === "_077_button_2") {
                StorageUtils.set(this.#key, "0");
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export {SetupItem077};