import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "./PersonalEquipmentManagement";
import Equipment from "./Equipment";
import _ from "lodash";
import TreasureBag from "./TreasureBag";
import CastleInformation from "../dashboard/CastleInformation";
import CastleWarehouse from "./CastleWarehouse";
import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";

class EquipmentStatusManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentStatusManager {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async updateEquipmentStatus() {
        const allEquipments: Equipment[] = [];

        // 解析身上的装备
        await this.#initializeEquipmentPage();
        _.forEach(this.#equipmentPage!.equipmentList!, it => {
            it.location = "P";
            allEquipments.push(it);
        });

        // 解析百宝袋中的装备
        const bag = this.#equipmentPage!.findTreasureBag();
        if (bag) {
            const bagPage = await new TreasureBag(this.#credential).open(bag.index!);
            _.forEach(bagPage.equipmentList!, it => {
                it.location = "B";
                allEquipments.push(it);
            });
        }

        // 解析城堡仓库中的装备
        const roleName = this.#equipmentPage!.role!.name!;
        const castlePage = await new CastleInformation().open();
        const castle = castlePage.findByRoleName(roleName);
        if (castle) {
            const warehousePage = await new CastleWarehouse(this.#credential).open();
            _.forEach(warehousePage.storageEquipmentList!, it => {
                it.location = "W";
                allEquipments.push(it);
            });
        }

        await this.#persistEquipmentList(allEquipments);
    }

    async #persistEquipmentList(equipmentList: Equipment[]) {
        const equipmentStatusList: string[] = [];
        for (const equipment of equipmentList) {
            if (equipment.isItem && (equipment.name !== "宠物蛋" && equipment.name !== "藏宝图" && equipment.name !== "威力宝石")) {
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
            s += equipment.location;
            if (equipment.using !== undefined) {
                s += "/";
                s += equipment.using;
            }
            equipmentStatusList.push(s);
        }

        const storage = RoleEquipmentStatusStorage.getInstance();
        await storage.write(this.#credential.id, JSON.stringify(equipmentStatusList));
    }
}

export = EquipmentStatusManager;