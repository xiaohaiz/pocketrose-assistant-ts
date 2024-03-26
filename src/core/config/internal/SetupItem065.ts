import _ from "lodash";
import MessageBoard from "../../../util/MessageBoard";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import EquipmentExperienceConfig from "../../equipment/EquipmentExperienceConfig";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem065 implements SetupItem {

    readonly #code: string = "065";
    readonly #name: string = "练装备的苦逼啊";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "其他";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        $("._065_button").off("click");
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<input type='button' class='_065_button' id='_065_a' value='武器' style='color:grey'>";
        html += "<input type='button' class='_065_button' id='_065_b' value='防具' style='color:grey'>";
        html += "<input type='button' class='_065_button' id='_065_c' value='饰品' style='color:grey'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const config = SetupLoader.loadEquipmentExperienceConfig(id!);
        if (config.weapon!) $("#_065_a").css("color", "blue");
        if (config.armor!) $("#_065_b").css("color", "blue");
        if (config.accessory!) $("#_065_c").css("color", "blue");

        $("._065_button").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            let config: EquipmentExperienceConfig | undefined = undefined;
            if (PageUtils.isColorGrey(buttonId)) {
                // Enable current setting
                config = this.#enable(id!, buttonId);
                $(event.target).css("color", "blue");
            } else if (PageUtils.isColorBlue(buttonId)) {
                // Disable current setting
                config = this.#disable(id!, buttonId);
                $(event.target).css("color", "grey");
            }
            if (config) {
                const document = config.asDocument();
                StorageUtils.set("_pa_065_" + id, JSON.stringify(document));
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
                $("#refreshButton").trigger("click");
            }
        });
    }

    #enable(id: string, buttonId: string): EquipmentExperienceConfig | undefined {
        const config = SetupLoader.loadEquipmentExperienceConfig(id!);
        if (_.endsWith(buttonId, "_a")) {
            config.weapon = true;
        } else if (_.endsWith(buttonId, "_b")) {
            config.armor = true;
        } else if (_.endsWith(buttonId, "_c")) {
            config.accessory = true;
        } else {
            return undefined;
        }
        return config;
    }

    #disable(id: string, buttonId: string): EquipmentExperienceConfig | undefined {
        const config = SetupLoader.loadEquipmentExperienceConfig(id!);
        if (_.endsWith(buttonId, "_a")) {
            config.weapon = false;
        } else if (_.endsWith(buttonId, "_b")) {
            config.armor = false;
        } else if (_.endsWith(buttonId, "_c")) {
            config.accessory = false;
        } else {
            return undefined;
        }
        return config;
    }

}


export = SetupItem065;