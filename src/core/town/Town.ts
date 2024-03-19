import Coordinate from "../../util/Coordinate";

class Town {

    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly coordinate: Coordinate;
    readonly image: string;
    readonly specialWeapons: string[];
    readonly specialArmors: string[];
    readonly specialAccessories: string[];

    constructor(id: string,
                name: string,
                description: string,
                coordinate: Coordinate,
                image: string,
                specialWeapons: string[],
                specialArmors: string[],
                specialAccessories: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.coordinate = coordinate;
        this.image = image;
        this.specialWeapons = specialWeapons;
        this.specialArmors = specialArmors;
        this.specialAccessories = specialAccessories;
    }

    asText(): string {
        return "(" + this.id + ") " + this.name + " " + this.coordinate.asText();
    }

    get nameTitle(): string {
        let title = "";
        for (let i = 0; i < this.name.length; i++) {
            title += this.name.charAt(i);
            if (i !== this.name.length - 1) {
                title += " ";
            }
        }
        return title;
    }
}

export = Town;