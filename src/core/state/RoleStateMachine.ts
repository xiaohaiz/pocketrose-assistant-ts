import RoleState from "./RoleState";

class RoleStateMachine {

    readonly #state: RoleState | null;

    #inTownHandler?: (state?: RoleState) => void;
    #inCastleHandler?: (state?: RoleState) => void;
    #inMapHandler?: (state?: RoleState) => void;
    #inMetroHandler?: (state?: RoleState) => void;
    #inTangHandler?: (state?: RoleState) => void;

    constructor(state: RoleState | null) {
        this.#state = state;
    }

    start(): RoleStateMachine {
        return this;
    }

    whenInTown(value: (state?: RoleState) => void): RoleStateMachine {
        this.#inTownHandler = value;
        return this;
    }

    whenInCastle(value: (state?: RoleState) => void): RoleStateMachine {
        this.#inCastleHandler = value;
        return this;
    }

    whenInMap(value: (state?: RoleState) => void): RoleStateMachine {
        this.#inMapHandler = value;
        return this;
    }

    whenInMetro(value: (state?: RoleState) => void): RoleStateMachine {
        this.#inMetroHandler = value;
        return this;
    }

    whenInTang(value: (state?: RoleState) => void): RoleStateMachine {
        this.#inTangHandler = value;
        return this;
    }

    process() {
        if (this.#state === null) {
            // No RoleState loaded, do nothing and ignore
            return;
        }
        switch (this.#state.location) {
            case "TOWN":
                this.#inTownHandler?.(this.#state);
                break;
            case "CASTLE":
                this.#inCastleHandler?.(this.#state);
                break;
            case "WILD":
                this.#inMapHandler?.(this.#state);
                break;
            case "METRO":
                this.#inMetroHandler?.(this.#state);
                break;
            case "TANG":
                this.#inTangHandler?.(this.#state);
                break;
        }
    }
}

export = RoleStateMachine;