import StorageUtils from "../util/StorageUtils";
import LocationState from "./LocationState";

/**
 * Location state machine, local storage is required.
 */
class LocationStateMachine {

    readonly #storageKey: string;


    constructor(id: string) {
        this.#storageKey = "_lc_" + id;
    }

    static currentLocationStateMachine(): LocationStateMachine {
        const id = $("input:hidden[name='id']:last").val() as string;
        return new LocationStateMachine(id);
    }

    inTown() {
        StorageUtils.set(this.#storageKey, "TOWN");
    }

    inCastle() {
        StorageUtils.set(this.#storageKey, "CASTLE");
    }

    inWild() {
        StorageUtils.set(this.#storageKey, "WILD");
    }

    load(): LocationState {
        const location = StorageUtils.get(this.#storageKey);
        return new LocationState(location);
    }
}

export = LocationStateMachine;