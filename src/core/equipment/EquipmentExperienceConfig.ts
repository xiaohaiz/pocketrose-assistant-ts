import StorageUtils from "../../util/StorageUtils";

class EquipmentExperienceConfig {

    weapon?: boolean;
    armor?: boolean;
    accessory?: boolean;

    get configured() {
        return (this.weapon !== undefined && this.weapon)
            || (this.armor !== undefined && this.armor)
            || (this.accessory !== undefined && this.accessory);
    }

    asDocument(): {} {
        const document = {};
        // @ts-ignore
        document["weapon"] = this.weapon;
        // @ts-ignore
        document["armor"] = this.armor;
        // @ts-ignore
        document["accessory"] = this.accessory;
        return document;
    }

    static defaultInstance(): EquipmentExperienceConfig {
        const config = new EquipmentExperienceConfig();
        config.weapon = false;
        config.armor = false;
        config.accessory = false;
        return config;
    }

    static writeConfig(id: string, config: EquipmentExperienceConfig) {
        const document = config.asDocument();
        StorageUtils.set("_pa_065_" + id, JSON.stringify(document));
    }

}

export = EquipmentExperienceConfig;