class EquipmentSet {

    weaponName?: string;
    weaponIndex?: number;
    weaponUsing?: boolean;
    armorName?: string;
    armorIndex?: number;
    armorUsing?: boolean;
    accessoryName?: string;
    accessoryIndex?: number;
    accessoryUsing?: boolean;
    treasureBagIndex?: number;

    initialize() {
        this.weaponName = undefined;
        this.weaponIndex = undefined;
        this.weaponUsing = undefined;
        this.armorName = undefined;
        this.armorIndex = undefined;
        this.armorUsing = undefined;
        this.accessoryName = undefined;
        this.accessoryIndex = undefined;
        this.accessoryUsing = undefined;
        this.treasureBagIndex = undefined;
    }

    get isAllFound() {
        if (this.weaponName !== undefined && this.weaponIndex === undefined) {
            return false;
        }
        if (this.armorName !== undefined && this.armorIndex === undefined) {
            return false;
        }
        return !(this.accessoryName !== undefined && this.accessoryIndex === undefined);
    }
}

export = EquipmentSet;