import CastleWarehousePage from "./CastleWarehousePage";
import Credential from "../../util/Credential";
import {Equipment} from "./Equipment";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import TreasureBagPage from "./TreasureBagPage";
import _ from "lodash";
import {RoleEquipmentStatus, RoleEquipmentStatusReport} from "./RoleEquipmentStatus";
import {RoleEquipmentStatusStorage} from "./RoleEquipmentStatusStorage";

class RoleEquipmentStatusManager {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async updatePersonalEquipmentStatus(page?: PersonalEquipmentManagementPage) {
        if (page === undefined) return;
        const list = page.equipmentList;
        if (list === undefined) return;
        await this.writeEquipmentStatus("P", list);
    }

    async updateTreasureBagEquipmentStatus(page?: TreasureBagPage) {
        if (page === undefined) return;
        const list = page.equipmentList;
        if (list === undefined) return;
        await this.writeEquipmentStatus("B", list);
    }

    async updateCastleWarehouseEquipmentStatus(page?: CastleWarehousePage) {
        if (page === undefined) return;
        const list = page.storageEquipmentList;
        if (list === undefined) return;
        await this.writeEquipmentStatus("W", list);
    }

    private async writeEquipmentStatus(location: string, equipmentList: Equipment[]) {
        // Count all gems
        let powerGemCount = 0;
        let luckGemCount = 0;
        let weightGemCount = 0;
        _.forEach(equipmentList, it => {
            if (it.name === "威力宝石") {
                powerGemCount++;
            } else if (it.name === "幸运宝石") {
                luckGemCount++;
            } else if (it.name === "重量宝石") {
                weightGemCount++;
            }
        });

        const equipmentStatusList: string[] = [];
        for (const equipment of equipmentList) {
            if (equipment.isItem &&
                (equipment.name !== "宠物蛋" && equipment.name !== "藏宝图" && equipment.name !== "威力宝石" && equipment.name !== "七心宝石")) {
                continue;
            }
            let s = "";
            s += _.escape(equipment.fullName);
            s += "/";
            s += equipment.category;
            s += "/";
            s += equipment.power;
            s += "/";
            s += equipment.weight;
            s += "/";
            s += equipment.endure;
            s += "/";
            s += equipment.additionalPower;
            s += "/";
            s += equipment.additionalWeight;
            s += "/";
            s += equipment.additionalLuck;
            s += "/";
            s += equipment.experience;
            s += "/";
            s += location;
            if (equipment.using !== undefined) {
                s += "/";
                s += equipment.using;
            }
            equipmentStatusList.push(s);
        }

        const record = new RoleEquipmentStatus();
        record.id = location + "/" + this.credential.id;
        record.updateTime = new Date().getTime();
        record.json = JSON.stringify(equipmentStatusList);
        record.powerGemCount = powerGemCount;
        record.weightGemCount = weightGemCount;
        record.luckGemCount = luckGemCount;
        await RoleEquipmentStatusStorage.write(record);
    }

    static async loadEquipmentStatusReports(roleIdList: string[]): Promise<Map<string, RoleEquipmentStatusReport>> {
        const reports = new Map<string, RoleEquipmentStatusReport>();
        if (_.isEmpty(roleIdList)) return reports;
        for (const roleId of roleIdList) {
            const report = await RoleEquipmentStatusManager.loadEquipmentStatusReport(roleId);
            reports.set(report.roleId!, report);
        }
        return reports;
    }

    static async loadEquipmentStatusReport(roleId: string): Promise<RoleEquipmentStatusReport> {

        const report = new RoleEquipmentStatusReport();
        report.roleId = roleId;
        report.equipmentList = [];
        report.powerGemCount = 0;
        report.weightGemCount = 0;
        report.luckGemCount = 0;

        const personal = await RoleEquipmentStatusStorage.load("P", roleId);
        RoleEquipmentStatusManager.mergeStatusReport(personal, report);

        const bag = await RoleEquipmentStatusStorage.load("B", roleId);
        RoleEquipmentStatusManager.mergeStatusReport(bag, report);

        const warehouse = await RoleEquipmentStatusStorage.load("W", roleId);
        RoleEquipmentStatusManager.mergeStatusReport(warehouse, report);

        report.equipmentList = Equipment.sortEquipmentList(report.equipmentList!);
        return report;
    }

    private static mergeStatusReport(source: RoleEquipmentStatus | undefined | null,
                                     target: RoleEquipmentStatusReport) {
        if (source === undefined || source === null) return;

        _.forEach(JSON.parse(source.json!) as string[])
            .map(it => Equipment.parse(it))
            .forEach(it => target.equipmentList!.push(it));

        target.powerGemCount = target.powerGemCount! + source.powerGemCount!;
        target.weightGemCount = target.weightGemCount! + source.weightGemCount!;
        target.luckGemCount = target.luckGemCount! + source.luckGemCount!;
    }
}

export {RoleEquipmentStatusManager};