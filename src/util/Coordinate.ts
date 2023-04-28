export = Coordinate;

class Coordinate {

    readonly #x: number;
    readonly #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    asText() {
        return "(" + this.#x + "," + this.#y + ")";
    }

    equals(other: Coordinate) {
        return this.#x === other.x && this.#y === other.y;
    }
}