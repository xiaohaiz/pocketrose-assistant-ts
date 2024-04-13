import Pet from "./Pet";

class CastleRanchPage {

    personalPetList?: Pet[];
    ranchPetList?: Pet[];

    get sortedRanchPetList(): Pet[] {
        if (this.ranchPetList === undefined) return [];
        return Pet.sortPetList(this.ranchPetList!);
    }

    findRanchPet(index: number | undefined | null): Pet | null {
        if (index === undefined || index === null) return null;
        if (this.ranchPetList === undefined) return null;
        for (const pet of this.ranchPetList) {
            if (pet.index === index) return pet;
        }
        return null;
    }
}

export = CastleRanchPage;