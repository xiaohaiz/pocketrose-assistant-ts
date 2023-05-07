import Coordinate from "../util/Coordinate";

class LocationState {

    readonly #location: string | null;

    #inTownHandler?: (townId?: string) => void;
    #inCastleHandler?: () => void;
    #inMapHandler?: (coordinate?: Coordinate) => void;

    constructor(location: string | null) {
        this.#location = location;
    }

    whenInTown(handler: (townId?: string) => void): LocationState {
        this.#inTownHandler = handler;
        return this;
    }

    whenInCastle(handler: () => void): LocationState {
        this.#inCastleHandler = handler;
        return this;
    }

    whenInMap(handler: (coordinate?: Coordinate) => void): LocationState {
        this.#inMapHandler = handler;
        return this;
    }

    fork() {
        const ss = this.#location?.split("/");
        if (ss === undefined || ss.length === 0) {
            // Do nothing in case of location is null.
            return;
        }
        if (ss[0] === "TOWN") {
            this.#inTownHandler?.(ss[1]);
        }
        if (ss[0] === "CASTLE") {
            this.#inCastleHandler?.();
        }
        if (ss[0] === "WILD") {
            const coordinate = Coordinate.parse(ss[1]);
            this.#inMapHandler?.(coordinate);
        }
    }
}

export = LocationState;