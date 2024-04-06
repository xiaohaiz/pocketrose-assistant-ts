class RoleUsingEquipment {

    id?: string;
    updateTime?: number;
    usingWeapon?: string;
    usingArmor?: string;
    usingAccessory?: string;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.usingWeapon) && (document.usingWeapon = this.usingWeapon);
        (this.usingArmor) && (document.usingArmor = this.usingArmor);
        (this.usingAccessory) && (document.usingAccessory = this.usingAccessory);
        return document;
    }

    get available(): boolean {
        return this.usingWeapon !== undefined || this.usingArmor !== undefined || this.usingAccessory !== undefined;
    }
}

export = RoleUsingEquipment;