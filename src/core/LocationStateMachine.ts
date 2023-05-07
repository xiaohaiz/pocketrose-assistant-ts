import StorageUtils from "../util/StorageUtils";
import LocationState from "./LocationState";
import StringUtils from "../util/StringUtils";

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
        const townId = $("input:hidden[name='townid']:last").val() as string;
        StorageUtils.set(this.#storageKey, "TOWN/" + townId);
    }

    inCastle() {
        StorageUtils.set(this.#storageKey, "CASTLE");
    }

    inMap() {
        let s = $("td:contains('现在位置')")
            .filter(function () {
                return $(this).text().startsWith("\n      现在位置");
            })
            .text();
        s = StringUtils.substringBetween(s, "现在位置(", ")");
        StorageUtils.set(this.#storageKey, "WILD/" + s);
    }

    load(): LocationState {
        const location = StorageUtils.get(this.#storageKey);
        return new LocationState(location);
    }
}

export = LocationStateMachine;