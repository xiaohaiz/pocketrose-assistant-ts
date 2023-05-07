class LocationState {

    readonly #location: string | null;

    inTownHandler?: () => void;
    inCastleHandler?: () => void;
    inWildHandler?: () => void;

    constructor(location: string | null) {
        this.#location = location;
    }

    whenInTown(handler: () => void) {
        this.inTownHandler = handler;
    }

    whenInCastle(handler: () => void) {
        this.inCastleHandler = handler;
    }

    whenInWild(handler: () => void) {
        this.inWildHandler = handler;
    }

    fork() {
        if (this.#location === "TOWN") {
            this.inTownHandler?.();
        }
        if (this.#location === "CASTLE") {
            this.inCastleHandler?.();
        }
        if (this.#location === "WILD") {
            this.inWildHandler?.();
        }
        // Do nothing in case of location is null.
    }
}

export = LocationState;