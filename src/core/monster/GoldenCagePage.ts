import Pet from "./Pet";

class GoldenCagePage {

    petList?: Pet[];

    get sortedPetList() {
        return Pet.sortPetList(this.petList!);
    }

    get spaceCount() {
        return 20 - this.petList!.length;
    }

    findPet(index: number): Pet | null {
        if (this.petList === undefined) return null;
        for (const pet of this.petList!) {
            if (pet.index === index) return pet;
        }
        return null;
    }
}

export = GoldenCagePage;