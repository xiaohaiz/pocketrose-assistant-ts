import _ from "lodash";
import PageUtils from "../../util/PageUtils";
import Equipment from "./Equipment";
import EquipmentLoader from "./EquipmentLoader";

class EquipmentSetConfig {

    index?: string;
    alias?: string;
    weaponName?: string;
    armorName?: string;
    accessoryName?: string;
    weaponStar?: boolean;
    armorStar?: boolean;
    accessoryStar?: boolean;

    get available(): boolean {
        return (this.weaponName !== undefined && this.weaponName !== "NONE")
            || (this.armorName !== undefined && this.armorName !== "NONE")
            || (this.accessoryName !== undefined && this.accessoryName !== "NONE");
    }

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

    static generateCandidates(mode: string, list1: Equipment[], list2?: Equipment[]) {
        const available: string[] = [];
        _.forEach(list1)
            .filter(it => {
                switch (mode) {
                    case "WEA":
                        return it.isWeapon;
                    case "ARM":
                        return it.isArmor;
                    case "ACC":
                        return it.isAccessory;
                    default:
                        return false;
                }
            })
            .map(it => it.fullName)
            .forEach(it => available.push(it));
        if (list2 !== undefined) {
            _.forEach(list2)
                .filter(it => {
                    switch (mode) {
                        case "WEA":
                            return it.isWeapon;
                        case "ARM":
                            return it.isArmor;
                        case "ACC":
                            return it.isAccessory;
                        default:
                            return false;
                    }
                })
                .map(it => it.fullName)
                .forEach(it => available.push(it));
        }

        let all: string[];
        switch (mode) {
            case "WEA":
                all = EquipmentLoader.loadWeaponList();
                break;
            case "ARM":
                all = EquipmentLoader.loadArmorList();
                break;
            case "ACC":
                all = EquipmentLoader.loadAccessoryList();
                break;
            default:
                return [];
        }
        const names: string[] = [];
        for (const it of all) {
            const s = "齐心★" + it;
            if (_.includes(available, s) && !_.includes(names, s)) {
                names.push(s);
            }
            if (_.includes(available, it) && !_.includes(names, it)) {
                names.push(it);
            }
        }
        return names;
    }

    static generateSelectHTML(candidate: string[]) {
        let html = "<select>";
        html += "<option value='NONE'>无</option>"
        _.forEach(candidate, it => {
            if (_.startsWith(it, "齐心★")) {
                html += "<option value='" + it + "' style='background-color:yellow'>" + it + "</option>";
            } else {
                html += "<option value='" + it + "'>" + it + "</option>";
            }
        });
        html += "</select>";
        return html;
    }
}

export = EquipmentSetConfig;