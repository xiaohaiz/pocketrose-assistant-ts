import _ from "lodash";
import Castle from "../common/Castle";
import Equipment from "../common/Equipment";
import Pet from "../common/Pet";
import CastleInformation from "../pocketrose/CastleInformation";
import CastleRanch from "../pocketrose/CastleRanch";
import GoldenCage from "../pocketrose/GoldenCage";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalPetManagement from "../pocketrose/PersonalPetManagement";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";

class RolePetManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerRolePetStatusUpdate(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                this.findAllRecognizedPets().then(petList => {
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

    async findAllRecognizedPets(): Promise<Pet[]> {
        return await (() => {
            return new Promise<Pet[]>(resolve => {
                const allPetList: Pet[] = [];

                new PersonalEquipmentManagement(this.#credential).open().then(equipmentPage => {
                    const roleName = equipmentPage.role!.name!;
                    const goldenCage = equipmentPage.findGoldenCage();

                    new CastleInformation().load(roleName)
                        .then(castle => {
                            doFindPersonalPets(this.#credential, allPetList, goldenCage, castle, () => {
                                resolve(allPetList);
                            });
                        })
                        .catch(() => {
                            doFindPersonalPets(this.#credential, allPetList, goldenCage, null, () => {
                                resolve(allPetList);
                            });
                        });
                });
            });
        })();
    }

}

function doFindPersonalPets(credential: Credential,
                            allPetList: Pet[],
                            goldenCage: Equipment | null,
                            castle: Castle | null,
                            handler: () => void) {
    new PersonalPetManagement(credential).open().then(petPage => {
        for (const pet of petPage.petList!) {
            pet.location = "P";
            allPetList.push(pet);
        }
        doFindCagePets(credential, allPetList, goldenCage, castle, handler);
    });
}

function doFindCagePets(credential: Credential,
                        allPetList: Pet[],
                        goldenCage: Equipment | null,
                        castle: Castle | null,
                        handler: () => void) {
    if (goldenCage === null) {
        doFindCastlePets(credential, allPetList, castle, handler);
    } else {
        new GoldenCage(credential).open(goldenCage.index!).then(cagePage => {
            for (const pet of cagePage.petList!) {
                pet.location = "C";
                allPetList.push(pet);
            }
            doFindCastlePets(credential, allPetList, castle, handler);
        });
    }
}

function doFindCastlePets(credential: Credential,
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


export = RolePetManager;