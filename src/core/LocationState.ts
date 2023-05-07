class LocationState {

    readonly #location: string | null;

    #inTownHandler?: () => void;
    #inCastleHandler?: () => void;
    #inWildHandler?: () => void;

    constructor(location: string | null) {
        this.#location = location;
    }

    whenInTown(handler: () => void): LocationState {
        this.#inTownHandler = handler;
        return this;
    }

    whenInCastle(handler: () => void): LocationState {
        this.#inCastleHandler = handler;
        return this;
    }

    whenInWild(handler: () => void): LocationState {
        this.#inWildHandler = handler;
        return this;
    }

    fork() {
        if (this.#location === "TOWN") {
            this.#inTownHandler?.();
        }
        if (this.#location === "CASTLE") {
            this.#inCastleHandler?.();
        }
        if (this.#location === "WILD") {
            this.#inWildHandler?.();
        }
        // Do nothing in case of location is null.
    }
}

export = LocationState;