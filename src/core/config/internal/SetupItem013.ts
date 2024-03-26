import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import BattleFieldConfigLoader from "../../battle/BattleFieldConfigLoader";
import SetupItem from "../SetupItem";

class SetupItem013 implements SetupItem {

    readonly #code: string = "013";
    readonly #name: string = "战斗场快捷设置";
    readonly #key: string = "_pa_012";              // 实际对应存储是“战斗场偏好设置”

    category(): string {
        return "置顶";
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
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" + this.#doGenerateSetupItem() + "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        this.#doProcessButtons(id);
    }

    #doGenerateSetupItem() {
        let html = "";
        html += "<input type='button' class='dynamic_button _013_button' id='_013_button_1' value='初级之森'>";
        html += "<input type='button' class='dynamic_button _013_button' id='_013_button_2' value='中级之塔'>";
        html += "<input type='button' class='dynamic_button _013_button' id='_013_button_3' value='上级之洞'>";
        html += "<input type='button' class='dynamic_button _013_button' id='_013_button_4' value='十二神殿'>";
        return html;
    }

    #doProcessButtons(id: string) {
        const config = BattleFieldConfigLoader.loadCustomizedConfig(id);
        if (config.primary) $("#_013_button_1").css("color", "blue").prop("disabled", true);
        if (config.junior) $("#_013_button_2").css("color", "blue").prop("disabled", true);
        if (config.senior) $("#_013_button_3").css("color", "blue").prop("disabled", true);
        if (config.zodiac) $("#_013_button_4").css("color", "blue").prop("disabled", true);

        $("._013_button").on("click", event => {
            $("._013_button").off("click");
            const buttonId = $(event.target).attr("id")!;
            const value = {};
            // @ts-ignore
            value["primary"] = false;
            // @ts-ignore
            value["junior"] = false;
            // @ts-ignore
            value["senior"] = false;
            // @ts-ignore
            value["zodiac"] = false;
            if (buttonId === "_013_button_1") {
                // @ts-ignore
                value["primary"] = true;
            } else if (buttonId === "_013_button_2") {
                // @ts-ignore
                value["junior"] = true;
            } else if (buttonId === "_013_button_3") {
                // @ts-ignore
                value["senior"] = true;
            } else if (buttonId === "_013_button_4") {
                // @ts-ignore
                value["zodiac"] = true;
            } else {
                return;
            }
            StorageUtils.set(this.#key + "_" + id, JSON.stringify(value));
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            $("#refreshButton").trigger("click");
        });
    }
}

export = SetupItem013;