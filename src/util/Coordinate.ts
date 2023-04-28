class Coordinate {

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get isAvailable(): boolean {
        return this.x >= 0 && this.x <= 15 &&
            this.y >= 0 && this.y <= 15;
    }

    asText(): string {
        return "(" + this.x + "," + this.y + ")";
    }

    equals(other: Coordinate): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export = Coordinate;