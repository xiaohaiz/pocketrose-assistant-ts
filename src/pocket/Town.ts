import Coordinate from "../util/Coordinate";

class Town {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly coordinate: Coordinate;

    constructor(id: string, name: string, description: string, coordinate: Coordinate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.coordinate = coordinate;
    }

    asText(): string {
        return "(" + this.id + ") " + this.name + " " + this.coordinate.asText();
    }
}

export = Town;