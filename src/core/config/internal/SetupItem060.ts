import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem060 implements SetupItem {

    readonly #code: string = "060";
    readonly #name: string = "简洁版宠物图鉴";
    readonly #key: string = "_pa_060";

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
        html += "<input type='button' class='dynamic_button _060_button' id='_060_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _060_button' id='_060_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        const value = SetupLoader.isBriefPetMapEnabled();
        $("._060_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._060_button").on("click", event => {
            $("._060_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_060_button_1") {
                StorageUtils.set(this.#key, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_060_button_2") {
                StorageUtils.set(this.#key, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用!");
            }
            $("#refreshButton").trigger("click");
        });
    }
}

export = SetupItem060;