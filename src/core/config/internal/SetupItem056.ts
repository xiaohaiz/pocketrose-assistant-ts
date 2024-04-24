import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import PageUtils from "../../../util/PageUtils";
import StringUtils from "../../../util/StringUtils";
import _ from "lodash";
import {BattleConfigManager} from "../ConfigManager";

class SetupItem056 implements SetupItem {

    readonly #code: string = "056";
    readonly #name: string = "全局战斗场偏好";
    readonly #key: string = "_pa_" + this.#code;

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
        this.#doRender();
    }

    #doRender() {
        $("#B_056_reset").off("click");
        $(".C_056_battle_field").off("click");

        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<button role='button' class='dynamic_button' id='B_056_reset'>重置</button>"
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<input type='button' class='dynamic_button C_056_battle_field' id='_056_button_1' value='初级之森'>";
        html += "<input type='button' class='dynamic_button C_056_battle_field' id='_056_button_2' value='中级之塔'>";
        html += "<input type='button' class='dynamic_button C_056_battle_field' id='_056_button_3' value='上级之洞'>";
        html += "<input type='button' class='dynamic_button C_056_battle_field' id='_056_button_4' value='十二神殿'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const config = BattleConfigManager.loadGlobalBattleFieldConfig();
        if (config.primary) $("#_056_button_1").css("color", "blue").prop("disabled", true);
        if (config.junior) $("#_056_button_2").css("color", "blue").prop("disabled", true);
        if (config.senior) $("#_056_button_3").css("color", "blue").prop("disabled", true);
        if (config.zodiac) $("#_056_button_4").css("color", "blue").prop("disabled", true);

        $(".C_056_battle_field").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const value: any = {};
            value.primary = false;
            value.junior = false;
            value.senior = false;
            value.zodiac = false;
            const mode = _.parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            switch (mode) {
                case 1:
                    value.primary = true;
                    break;
                case 2:
                    value.junior = true;
                    break;
                case 3:
                    value.senior = true;
                    break;
                case 4:
                    value.zodiac = true;
                    break;
            }
            StorageUtils.set(this.#key, JSON.stringify(value));
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            PageUtils.triggerClick("refreshButton");
        });

        $("#B_056_reset").on("click", () => {
            PageUtils.disableElement("B_056_reset");
            StorageUtils.remove(this.#key);
            PageUtils.enableElement("B_056_reset");
            PageUtils.triggerClick("refreshButton");
        });
    }
}

export = SetupItem056;