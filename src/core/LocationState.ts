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
        const ss = this.#location?.split("/");
        if (ss === undefined || ss.length === 0) {
            // Do nothing in case of location is null.
            return;
        }
        if (ss[0] === "TOWN") {
            this.#inTownHandler?.();
        }
        if (ss[0] === "CASTLE") {
            this.#inCastleHandler?.();
        }
        if (ss[0] === "WILD") {
            this.#inWildHandler?.();
        }
    }
}

export = LocationState;