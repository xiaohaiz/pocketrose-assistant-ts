class LocationState {

    readonly #location: string | null;

    constructor(location: string | null) {
        this.#location = location;
    }
}

export = LocationState;