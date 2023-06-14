import Pet from "../core/monster/Pet";

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
}

export = PersonalPetManagementPage;