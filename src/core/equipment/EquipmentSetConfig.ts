class EquipmentSetConfig {

    index?: string;
    weaponName?: string;
    armorName?: string;
    accessoryName?: string;

    static defaultInstance(index?: string): EquipmentSetConfig {
        const config = new EquipmentSetConfig();
        config.index = index;
        config.weaponName = "NONE";
        config.armorName = "NONE";
        config.accessoryName = "NONE";
        return config;
    }

}

export = EquipmentSetConfig;