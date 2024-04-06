import Town from "../town/Town";
import TownLoader from "../town/TownLoader";

class LocationModeTown {

    readonly townId: string;
    readonly town: Town;

    constructor(townId: string) {
        this.townId = townId;
        this.town = TownLoader.load(this.townId)!;
    }
}

export = LocationModeTown;