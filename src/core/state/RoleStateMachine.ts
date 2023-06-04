import RoleState from "./RoleState";

class RoleStateMachine {

    readonly #state: RoleState | null;

    constructor(state: RoleState | null) {
        this.#state = state;
    }
}

export = RoleStateMachine;