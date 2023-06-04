import Coordinate from "../../util/Coordinate";

class RoleState {

    id?: string;
    updateTime?: number;
    location?: string;
    townId?: string;
    battleCount?: number;
    castleName?: string;
    coordinate?: string;

    asObject() {
        const data: {} = {
            id: this.id
        };
        if (this.updateTime !== undefined) {
            // @ts-ignore
            data.updateTime = this.updateTime;
        }
        if (this.location !== undefined) {
            // @ts-ignore
            data.location = this.location;
        }
        if (this.townId !== undefined) {
            // @ts-ignore
            data.townId = this.townId;
        }
        if (this.battleCount !== undefined) {
            // @ts-ignore
            data.battleCount = this.battleCount;
        }
        if (this.castleName !== undefined) {
            // @ts-ignore
            data.castleName = this.castleName;
        }
        if (this.coordinate !== undefined) {
            // @ts-ignore
            data.coordinate = this.coordinate;
        }

        return data;
    }

    asCoordinate(): Coordinate | undefined {
        if (this.coordinate === undefined) {
            return undefined;
        }
        return Coordinate.parse(this.coordinate);
    }

}

export = RoleState;
