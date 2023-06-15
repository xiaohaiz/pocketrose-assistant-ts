import _ from "lodash";
import CastleInformation from "../../pocketrose/CastleInformation";
import CastleRanch from "../../pocketrose/CastleRanch";
import GoldenCage from "../../pocketrose/GoldenCage";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalPetManagement from "../../pocketrose/PersonalPetManagement";
import TownPetMapHouse from "../../pocketrose/TownPetMapHouse";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import Castle from "../castle/Castle";
import SetupLoader from "../config/SetupLoader";
import Equipment from "../equipment/Equipment";
import RoleStorageManager from "../role/RoleStorageManager";
import Pet from "./Pet";

class PetLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerUpdatePetMap(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                // 自动保存启用时，战数尾数为83时，触发图鉴保存
                const doStorage = (battleCount % 100 === 83);
                if (doStorage) {
                    CommentBoard.writeMessage("<br>开始更新宠物图鉴......");
                    this.updatePetMap().then(() => resolve());
                } else {
                    resolve();
                }
            });
        })();
    }

    async triggerUpdatePetStatus(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                // 自动保存启用时，战数尾数为89时，触发宠物保存
                const doStorage = (battleCount % 100 === 89 && SetupLoader.isAutoPetStatusStorageEnabled());
                if (doStorage) {
                    CommentBoard.writeMessage("<br>开始更新宠物状态......");
                    this.updatePetStatus().then(() => resolve());
                } else {
                    resolve();
                }
            });
        })();
    }

    async updatePetMap(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                new TownPetMapHouse(this.#credential).open().then(page => {
                    const json = page.asJson();
                    RoleStorageManager.getRolePetMapStorage()
                        .write(this.#credential.id, json)
                        .then(() => {
                            resolve();
                        });
                });
            });
        })();
    }

    async updatePetStatus(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                this.#findAllPets().then(petList => {
                    const petStatusList: string[] = [];
                    for (const pet of petList) {
                        let s = "";
                        s += _.escape(pet.name);
                        s += "/";
                        s += pet.gender;
                        s += "/";
                        s += pet.level;
                        s += "/";
                        s += pet.maxHealth;
                        s += "/";
                        s += pet.attack;
                        s += "/";
                        s += pet.defense;
                        s += "/";
                        s += pet.specialAttack;
                        s += "/";
                        s += pet.specialDefense;
                        s += "/";
                        s += pet.speed;
                        s += "/";
                        s += pet.location;
                        petStatusList.push(s);
                    }

                    RoleStorageManager.getRolePetStatusStorage()
                        .write(this.#credential.id, JSON.stringify(petStatusList))
                        .then(() => {
                            resolve();
                        });
                });
            });
        })();
    }

    async #findAllPets(): Promise<Pet[]> {
        return await (() => {
            return new Promise<Pet[]>(resolve => {
                const allPetList: Pet[] = [];

                new PersonalEquipmentManagement(this.#credential).open().then(equipmentPage => {
                    const roleName = equipmentPage.role!.name!;
                    const goldenCage = equipmentPage.findGoldenCage();

                    new CastleInformation().load(roleName)
                        .then(castle => {
                            __parsePersonalPets(this.#credential, allPetList, goldenCage, castle, () => {
                                resolve(allPetList);
                            });
                        })
                        .catch(() => {
                            __parsePersonalPets(this.#credential, allPetList, goldenCage, null, () => {
                                resolve(allPetList);
                            });
                        });
                });
            });
        })();
    }
}

function __parsePersonalPets(credential: Credential,
                             allPetList: Pet[],
                             goldenCage: Equipment | null,
                             castle: Castle | null,
                             handler: () => void) {
    new PersonalPetManagement(credential).open().then(petPage => {
        for (const pet of petPage.petList!) {
            pet.location = "P";
            allPetList.push(pet);
        }
        __parseCagePets(credential, allPetList, goldenCage, castle, handler);
    });
}

function __parseCagePets(credential: Credential,
                         allPetList: Pet[],
                         goldenCage: Equipment | null,
                         castle: Castle | null,
                         handler: () => void) {
    if (goldenCage === null) {
        __parseRanchPets(credential, allPetList, castle, handler);
    } else {
        new GoldenCage(credential).open(goldenCage.index!).then(cagePage => {
            for (const pet of cagePage.petList!) {
                pet.location = "C";
                allPetList.push(pet);
            }
            __parseRanchPets(credential, allPetList, castle, handler);
        });
    }
}

function __parseRanchPets(credential: Credential,
                          allPetList: Pet[],
                          castle: Castle | null,
                          handler: () => void) {
    if (castle === null) {
        handler();
    } else {
        new CastleRanch(credential).enter().then(ranchPage => {
            for (const pet of ranchPage.ranchPetList!) {
                pet.location = "R";
                allPetList.push(pet);
            }
            handler();
        });
    }
}

export = PetLocalStorage;