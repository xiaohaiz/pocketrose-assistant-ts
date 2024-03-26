import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem014 implements SetupItem {

    readonly #code: string = "014";
    readonly #name: string = "关闭转职的入口";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "其他";
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
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<input type='button' class='dynamic_button _014_button' id='_014_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _014_button' id='_014_button_2' value='禁用'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton(id);
    }

    #doProcessButton(id: string) {
        const value = SetupLoader.isCareerTransferEntranceDisabled(id);
        $("._014_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._014_button").on("click", event => {
            $("._014_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_014_button_1") {
                StorageUtils.set(this.#key + "_" + id, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_014_button_2") {
                StorageUtils.set(this.#key + "_" + id, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用！");
            }
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem014;