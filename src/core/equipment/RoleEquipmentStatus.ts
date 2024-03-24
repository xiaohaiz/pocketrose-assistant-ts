class RoleEquipmentStatus {

    id?: string;
    json?: string;
    updateTime?: number;
    powerGemCount?: number;
    luckGemCount?: number;
    weightGemCount?: number;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.json) && (document.json = this.json);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.powerGemCount !== undefined) && (document.powerGemCount = this.powerGemCount);
        (this.luckGemCount !== undefined) && (document.luckGemCount = this.luckGemCount);
        (this.weightGemCount !== undefined) && (document.weightGemCount = this.weightGemCount);
        return document;
    }
}

export = RoleEquipmentStatus;