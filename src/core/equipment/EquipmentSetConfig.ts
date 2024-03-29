import _ from "lodash";
import PageUtils from "../../util/PageUtils";

class EquipmentSetConfig {

    index?: string;
    alias?: string;
    weaponName?: string;
    armorName?: string;
    accessoryName?: string;
    weaponStar?: boolean;
    armorStar?: boolean;
    accessoryStar?: boolean;

    static defaultInstance(index?: string): EquipmentSetConfig {
        const config = new EquipmentSetConfig();
        config.index = index;
        config.weaponName = "NONE";
        config.armorName = "NONE";
        config.accessoryName = "NONE";
        return config;
    }

    static generateSetupHTML(index: string,
                             weaponList: string[],
                             armorList: string[],
                             accessoryList: string[]): string {
        let html = "";
        html += "<input type='text' id='ES_ALIAS_" + index + "' size='5' maxlength='10'>";
        html += "<button role='button' id='ES_WEA_STAR_" + index + "' style='color:grey' " +
            "class='_star_button_" + index + "'>齐心</button>";
        html += "<select name='ES_WEA_" + index + "'>";
        html += "<option class='ES_WEA_OPTION_" + index + "' value='NONE'>无</option>";
        _.forEach(weaponList, it => {
            html += "<option class='ES_WEA_OPTION_" + index + "' value='" + it + "'>" + it + "</option>";
        });
        html += "</select>";
        html += "<button role='button' id='ES_ARM_STAR_" + index + "' style='color:grey' " +
            "class='_star_button_" + index + "'>齐心</button>";
        html += "<select name='ES_ARM_" + index + "'>";
        html += "<option class='ES_ARM_OPTION_" + index + "' value='NONE'>无</option>";
        _.forEach(armorList, it => {
            html += "<option class='ES_ARM_OPTION_" + index + "' value='" + it + "'>" + it + "</option>";
        });
        html += "</select>";
        html += "<button role='button' id='ES_ACC_STAR_" + index + "' style='color:grey' " +
            "class='_star_button_" + index + "'>齐心</button>";
        html += "<select name='ES_ACC_" + index + "'>";
        html += "<option class='ES_ACC_OPTION_" + index + "' value='NONE'>无</option>";
        _.forEach(accessoryList, it => {
            html += "<option class='ES_ACC_OPTION_" + index + "' value='" + it + "'>" + it + "</option>";
        });
        html += "</select>";
        return html;
    }

    renderSetupItem(): EquipmentSetConfig {
        if (this.alias !== undefined) {
            $("#ES_ALIAS_" + this.index).val(this.alias);
        }
        if (this.weaponStar) {
            $("#ES_WEA_STAR_" + this.index).css("color", "blue");
        }
        if (this.armorStar) {
            $("#ES_ARM_STAR_" + this.index).css("color", "blue");
        }
        if (this.accessoryStar) {
            $("#ES_ACC_STAR_" + this.index).css("color", "blue");
        }

        $(".ES_WEA_OPTION_" + this.index + "[value='" + this.weaponName + "']")
            .prop("selected", true);
        $(".ES_ARM_OPTION_" + this.index + "[value='" + this.armorName + "']")
            .prop("selected", true);
        $(".ES_ACC_OPTION_" + this.index + "[value='" + this.accessoryName + "']")
            .prop("selected", true);

        return this;
    }

    bind(setupButtonId: string, handler?: (config: EquipmentSetConfig) => void) {
        $("._star_button_" + this.index).on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            if (PageUtils.isColorBlue(buttonId)) {
                $(event.target).css("color", "grey");
            } else if (PageUtils.isColorGrey(buttonId)) {
                $(event.target).css("color", "blue");
            }
        });
        $("#" + setupButtonId).on("click", () => {
            const config = new EquipmentSetConfig();
            const alias = $("#ES_ALIAS_" + this.index).val() as string;
            if (_.trim(alias) !== "") {
                config.alias = _.trim(alias);
            }
            config.weaponStar = PageUtils.isColorBlue("ES_WEA_STAR_" + this.index);
            config.armorStar = PageUtils.isColorBlue("ES_ARM_STAR_" + this.index);
            config.accessoryStar = PageUtils.isColorBlue("ES_ACC_STAR_" + this.index);

            config.weaponName = $("select[name='ES_WEA_" + this.index + "']").val() as string;
            config.armorName = $("select[name='ES_ARM_" + this.index + "']").val() as string;
            config.accessoryName = $("select[name='ES_ACC_" + this.index + "']").val() as string;

            if (config.weaponName === "NONE") config.weaponStar = false;
            if (config.armorName === "NONE") config.armorStar = false;
            if (config.accessoryName === "NONE") config.accessoryStar = false;

            if (handler) handler(config);
        });
    }
}

export = EquipmentSetConfig;