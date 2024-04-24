import MessageBoard from "../../../util/MessageBoard";
import SetupItem from "../SetupItem";
import {BattleConfigManager} from "../ConfigManager";

class SetupItem046 implements SetupItem {

    readonly #code = "046";
    readonly #name = "战斗后隐藏按钮";
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
        html += "<input type='button' class='dynamic_button _046_button' id='_046_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _046_button' id='_046_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        if (BattleConfigManager.isHiddenBattleButtonEnabled()) {
            $("#_046_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_046_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._046_button").on("click", event => {
            $("._046_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_046_button_1") {
                BattleConfigManager.enableHiddenBattleButton();
            } else if (buttonId === "_046_button_2") {
                BattleConfigManager.disableHiddenBattleButton();
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export {SetupItem046};