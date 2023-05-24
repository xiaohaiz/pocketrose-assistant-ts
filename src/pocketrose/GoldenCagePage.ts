import Pet from "../common/Pet";

class GoldenCagePage {

    petList?: Pet[];

    get sortedPetList() {
        return Pet.sortPetList(this.petList!);
    }

    get spaceCount() {
        return 20 - this.petList!.length;
    }
}

export = GoldenCagePage;