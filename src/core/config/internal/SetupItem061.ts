import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem061 implements SetupItem {

    readonly #code: string = "061";
    readonly #name: string = "给我锁死在上洞";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "战斗";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        this.#doRender(id!);
    }

    #doRender(id: string) {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='button' class='dynamic_button _061_button' id='_061_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _061_button' id='_061_button_2' value='禁用'>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>";
        html += "仅限于配合智能选择战斗场所使用，启用此设置后智能选择会强制锁死上洞。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton(id);
    }

    #doProcessButton(id: string) {
        const value = SetupLoader.isForceSeniorBattleEnabled(id);
        $("._061_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._061_button").on("click", event => {
            $("._061_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_061_button_1") {
                StorageUtils.set(this.#key + "_" + id, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_061_button_2") {
                StorageUtils.set(this.#key + "_" + id, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用！");
            }
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem061;