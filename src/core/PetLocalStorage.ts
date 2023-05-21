import _ from "lodash";
import Castle from "../common/Castle";
import Equipment from "../common/Equipment";
import Pet from "../common/Pet";
import SetupLoader from "../config/SetupLoader";
import CastleInformation from "../pocketrose/CastleInformation";
import CastleRanch from "../pocketrose/CastleRanch";
import GoldenCage from "../pocketrose/GoldenCage";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalPetManagement from "../pocketrose/PersonalPetManagement";
import TownPetMapHouse from "../pocketrose/TownPetMapHouse";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";

class PetLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerUpdatePetMap(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const configCount = SetupLoader.getSavePetMapBattleCount();
                if (battleCount > 0 && configCount > 0 && battleCount % configCount === 0) {
                    this.updatePetMap().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        })();
    }

    async triggerUpdatePetStatus(battleCount: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const configCount = SetupLoader.getSavePetBattleCount();
                if (battleCount > 0 && configCount > 0 && battleCount % configCount === 0) {
                    this.updatePetStatus().then(() => {
                        resolve();
                    });
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
                    const value = page.asText();
                    const key = "_pm_" + this.#credential.id;
                    StorageUtils.set(key, value);
                    resolve();
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
                        s += pet.name;
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

                    const key = "_ps_" + this.#credential.id;
                    const value = _.join(petStatusList, " ");
                    StorageUtils.set(key, value);

                    resolve();
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