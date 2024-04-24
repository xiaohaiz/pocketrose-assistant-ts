import MessageBoard from "../../../util/MessageBoard";
import SetupItem from "../SetupItem";
import {BattleConfigManager} from "../ConfigManager";

class SetupItem045 implements SetupItem {

    readonly #code = "045";
    readonly #name = "安全的战斗按钮";
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
        html += "<input type='button' class='dynamic_button _045_button' id='_045_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _045_button' id='_045_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        if (BattleConfigManager.isSafeBattleButtonEnabled()) {
            $("#_045_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_045_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._045_button").on("click", event => {
            $("._045_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_045_button_1") {
                BattleConfigManager.enableSafeBattleButton();
            } else if (buttonId === "_045_button_2") {
                BattleConfigManager.disableSafeBattleButton();
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export {SetupItem045};