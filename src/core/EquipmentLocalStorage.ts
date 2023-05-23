import _ from "lodash";
import Castle from "../common/Castle";
import Equipment from "../common/Equipment";
import SetupLoader from "../config/SetupLoader";
import CastleInformation from "../pocketrose/CastleInformation";
import CastleWarehouse from "../pocketrose/CastleWarehouse";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../pocketrose/PersonalEquipmentManagementPage";
import TreasureBag from "../pocketrose/TreasureBag";
import CommentBoard from "../util/CommentBoard";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";

class EquipmentLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerUpdateEquipmentStatus(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                // 自动保存启用时，战数尾数为97时，触发装备保存
                const doStorage = (battleCount % 100 === 97 && SetupLoader.isAutoEquipmentStatusStorageEnabled());
                if (doStorage) {
                    CommentBoard.writeMessage("<br>开始更新装备状态......");
                    this.updateEquipmentStatus().then(() => resolve());
                } else {
                    resolve();
                }
            });
        })();
    }

    async updateEquipmentStatus(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                findAllEquipments(this.#credential).then(equipmentList => {

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

                        equipmentStatusList.push(s);
                    }

                    const key = "_es_" + this.#credential.id;
                    const value = _.join(equipmentStatusList, "$$");
                    StorageUtils.set(key, value);

                    resolve();
                });
            });
        })();
    }
}

async function findAllEquipments(credential: Credential): Promise<Equipment[]> {
    return await (() => {
        return new Promise<Equipment[]>(resolve => {
            const allEquipments: Equipment[] = [];

            new PersonalEquipmentManagement(credential).open().then(equipmentPage => {
                const roleName = equipmentPage.role!.name!;
                new CastleInformation().load(roleName)
                    .then(castle => {
                        // Castle found
                        parseEquipments(credential, allEquipments, equipmentPage, castle, () => resolve(allEquipments));
                    })
                    .catch(() => {
                        // No castle found
                        parseEquipments(credential, allEquipments, equipmentPage, null, () => resolve(allEquipments));
                    });
            });
        });
    })();
}

function parseEquipments(credential: Credential,
                         allEquipments: Equipment[],
                         equipmentPage: PersonalEquipmentManagementPage,
                         castle: Castle | null,
                         handler: () => void) {
    _.forEach(equipmentPage.equipmentList!, it => {
        it.location = "P";
        allEquipments.push(it);
    });

    const bag = equipmentPage.findTreasureBag();
    if (bag !== null) {
        new TreasureBag(credential).open(bag.index!).then(bagPage => {
            _.forEach(bagPage.equipmentList!, it => {
                it.location = "B";
                allEquipments.push(it);
            });
            parseWarehouseEquipments(credential, allEquipments, castle, handler);
        });
    } else {
        parseWarehouseEquipments(credential, allEquipments, castle, handler);
    }
}

function parseWarehouseEquipments(credential: Credential,
                                  allEquipments: Equipment[],
                                  castle: Castle | null,
                                  handler: () => void) {
    if (castle === null) {
        handler();
    } else {
        new CastleWarehouse(credential).open().then(warehousePage => {
            _.forEach(warehousePage.storageEquipmentList!, it => {
                it.location = "W";
                allEquipments.push(it);
            });
            handler();
        });
    }
}

export = EquipmentLocalStorage;