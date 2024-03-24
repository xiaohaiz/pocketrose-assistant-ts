import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import Equipment from "../equipment/Equipment";
import _ from "lodash";
import TreasureBag from "../equipment/TreasureBag";
import CastleInformation from "../dashboard/CastleInformation";
import CastleWarehouse from "../equipment/CastleWarehouse";
import RoleEquipmentStatusStorage from "../equipment/RoleEquipmentStatusStorage";

/**
 * ============================================================================
 * 装 备 状 态 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，尾数19/37/59/79/97。
 * 2. 战斗入手（非图鉴）触发。
 * ----------------------------------------------------------------------------
 * 统计用，非实时需求。
 * ============================================================================
 */
class EquipmentStatusTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentStatusTrigger {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    /**
     * equipmentPage is required.
     */
    async triggerUpdate() {
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
        await storage.write(
            this.#credential.id,
            JSON.stringify(equipmentStatusList),
            powerGemCount,
            luckGemCount,
            weightGemCount
        );
    }
}

export = EquipmentStatusTrigger;