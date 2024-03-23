import Pet from "./Pet";

class PersonalPetManagementPage {

    petList?: Pet[];
    petStudyStatus?: number[];

    findPet(index: number) {
        for (const pet of this.petList!) {
            if (pet.index === index) {
                return pet;
            }
        }
        return null;
    }

    get usingPet(): Pet | null {
        if (!this.petList) return null;
        for (const pet of this.petList) {
            if (pet.using) {
                return pet;
            }
        }
        return null;
    }
}

export = PersonalPetManagementPage;