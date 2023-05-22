import _ from "lodash";
import Castle from "../common/Castle";
import Equipment from "../common/Equipment";
import CastleInformation from "../pocketrose/CastleInformation";
import CastleWarehouse from "../pocketrose/CastleWarehouse";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../pocketrose/PersonalEquipmentManagementPage";
import TreasureBag from "../pocketrose/TreasureBag";
import Credential from "../util/Credential";

class EquipmentLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
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