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
}

export = RoleStateMachine;