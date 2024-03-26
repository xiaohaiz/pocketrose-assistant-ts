import MessageBoard from "../../../util/MessageBoard";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import EquipmentSetConfig from "../../equipment/EquipmentSetConfig";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem020 implements SetupItem {

    readonly #code: string = "020";
    readonly #name: string = "自定义的套装Ｂ";
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
        const setIndex = "B";

        $("#_020_button").off("click");
        $("._star_button_" + setIndex).off("click");

        const weaponList = $("#weapon_list").text().split(",");
        const armorList = $("#armor_list").text().split(",");
        const accessoryList = $("#accessory_list").text().split(",");

        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<input type='button' class='dynamic_button' id='_020_button' value='设置'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += EquipmentSetConfig.generateSetupHTML(setIndex, weaponList, armorList, accessoryList);
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        // Render setup item.
        SetupLoader.loadEquipmentSetConfig(id, setIndex)
            .renderSetupItem()
            .bind("_020_button", config => {
                StorageUtils.set(this.#key + "_" + id, JSON.stringify(config));
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
                PageUtils.triggerClick("refreshButton");
            });
    }

}


export = SetupItem020;