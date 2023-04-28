import Coordinate from "../util/Coordinate";

export = Town;

class Town {
    readonly #id: string;
    readonly #name: string;
    readonly #description: string;
    readonly #coordinate: Coordinate;

    constructor(id: string, name: string, description: string, coordinate: Coordinate) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#coordinate = coordinate;
    }

    get id(): string {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    get description(): string {
        return this.#description;
    }

    get coordinate(): Coordinate {
        return this.#coordinate;
    }

    asText(): string {
        return "(" + this.#id + ") " + this.#name + " " + this.#coordinate.asText();
    }
}