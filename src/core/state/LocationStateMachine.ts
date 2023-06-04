import StorageUtils from "../../util/StorageUtils";
import LocationState from "./LocationState";

/**
 * Location state machine, local storage is required.
 */
class LocationStateMachine {

    readonly #storageKey: string;


    constructor(id: string) {
        this.#storageKey = "_lc_" + id;
    }

    static create(): LocationStateMachine {
        const id = $("input:hidden[name='id']:last").val() as string;
        return new LocationStateMachine(id);
    }


    load(): LocationState {
        const location = StorageUtils.get(this.#storageKey);
        return new LocationState(location);
    }
}

export = LocationStateMachine;