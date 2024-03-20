import _ from "lodash";
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

    get specialWeaponsList(): string {
        let s = "";
        for (const it of this.specialWeapons) {
            s += "【" + it + "】";
        }
        return s;
    }

    get specialArmorsList(): string {
        let s = "";
        for (const it of this.specialArmors) {
            s += "【" + it + "】";
        }
        return s;
    }

    get specialAccessoriesList(): string {
        let s = "";
        for (const it of this.specialAccessories) {
            s += "【" + it + "】";
        }
        return s;
    }

    hasSpecial(s: string): boolean {
        for (const it of this.specialWeapons) {
            if (_.includes(it, s)) {
                return true;
            }
        }
        for (const it of this.specialArmors) {
            if (_.includes(it, s)) {
                return true;
            }
        }
        for (const it of this.specialAccessories) {
            if (_.includes(it, s)) {
                return true;
            }
        }
        return false;
    }
}

export = Town;