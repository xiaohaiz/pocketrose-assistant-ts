import {Equipment} from "./Equipment";

class RoleEquipmentStatus {

    id?: string;                // Usage: (P|B|W)/roleId
    updateTime?: number;
    json?: string;
    powerGemCount?: number;
    weightGemCount?: number;
    luckGemCount?: number;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.json) && (document.json = this.json);
        (this.powerGemCount !== undefined) && (document.powerGemCount = this.powerGemCount);
        (this.weightGemCount !== undefined) && (document.weightGemCount = this.weightGemCount);
        (this.luckGemCount !== undefined) && (document.luckGemCount = this.luckGemCount);
        return document;
    }
}

class RoleEquipmentStatusReport {

    roleId?: string;
    equipmentList?: Equipment[];
    powerGemCount?: number;
    weightGemCount?: number;
    luckGemCount?: number;

}

export {RoleEquipmentStatus, RoleEquipmentStatusReport};