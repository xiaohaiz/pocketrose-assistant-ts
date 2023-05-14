import Pet from "../common/Pet";

class GoldenCagePage {

    petList?: Pet[];

    get sortedPetList() {
        return Pet.sortPetList(this.petList!);
    }

}

export = GoldenCagePage;