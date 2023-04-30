export class Spell {

    id?: string;
    name?: string;
    power?: number;
    accuracy?: number;
    pp?: number;

    get score(): number {
        return this.power! * this.accuracy!;
    }
}