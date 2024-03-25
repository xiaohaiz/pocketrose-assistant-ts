import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem068 implements SetupItem {

    readonly #code = "068";
    readonly #name = "团队宝石数量控";
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
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='button' class='dynamic_button _068_button' id='_068_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _068_button' id='_068_button_2' value='禁用'>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>";
        html += "战斗布局专属设置，建议选择任意一位队员开启即可。"
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton(id!);
    }

    #doProcessButton(id: string) {
        if (SetupLoader.isGemCountVisible(id)) {
            $("#_068_button_1").css("color", "blue").prop("disabled", true);
        } else {
            $("#_068_button_2").css("color", "blue").prop("disabled", true);
        }

        $("._068_button").on("click", event => {
            $("._068_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_068_button_1") {
                StorageUtils.set(this.#key + "_" + id, "1");
            } else if (buttonId === "_068_button_2") {
                StorageUtils.set(this.#key + "_" + id, "0");
            } else {
                return;
            }
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem068;