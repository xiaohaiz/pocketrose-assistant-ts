import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem063 implements SetupItem {

    readonly #code: string = "063";
    readonly #name: string = "十二宫宠物亲密";
    readonly #key: string = "_pa_" + this.#code;

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
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='button' class='dynamic_button _063_button' id='_063_button_1' value='启用'>";
        html += "<input type='button' class='dynamic_button _063_button' id='_063_button_2' value='禁用'>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>";
        html += "十二宫战斗时，<span style='background-color:red'>正在使用</span>的<span style='background-color:red'>满级</span>" +
            "宠物亲密度低于<span style='background-color:blue;color:wheat'>95</span>时自动补满。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.#doProcessButton();
    }

    #doProcessButton() {
        const value = SetupLoader.isZodiacBattlePetLoveAutoFixEnabled();
        $("._063_button[value='" + (value ? "启用" : "禁用") + "']")
            .css("color", "blue")
            .prop("disabled", true);

        $("._063_button").on("click", event => {
            $("._063_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            if (buttonId === "_063_button_1") {
                StorageUtils.set(this.#key, "1");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已启用!");
            } else if (buttonId === "_063_button_2") {
                StorageUtils.set(this.#key, "0");
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已禁用！");
            }
            $("#refreshButton").trigger("click");
        });
    }

}

export = SetupItem063;