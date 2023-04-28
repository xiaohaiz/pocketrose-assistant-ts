export = Coordinate;

class Coordinate {

    readonly #x: number;
    readonly #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }

    asText(): string {
        return "(" + this.#x + "," + this.#y + ")";
    }

    equals(other: Coordinate): boolean {
        return this.#x === other.x && this.#y === other.y;
    }
}