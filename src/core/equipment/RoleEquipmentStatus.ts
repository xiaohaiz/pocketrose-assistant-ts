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

    get formattedPowerGemCountHTML() {
        return this.powerGemCount === undefined || this.powerGemCount === 0 ?
            "-" : "<span style='color:blue;font-weight:bold'>" + this.powerGemCount + "</span>";
    }

    get formattedWeightGemCountHTML() {
        return this.weightGemCount === undefined || this.weightGemCount === 0 ?
            "-" : "<span style='color:green;font-weight:bold'>" + this.weightGemCount + "</span>";
    }

    get formattedLuckGemCountHTML() {
        return this.luckGemCount === undefined || this.luckGemCount === 0 ?
            "-" : "<span style='color:red;font-weight:bold'>" + this.luckGemCount + "</span>";
    }
}

export {RoleEquipmentStatus, RoleEquipmentStatusReport};