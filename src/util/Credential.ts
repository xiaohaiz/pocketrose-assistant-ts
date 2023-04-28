export = Credential;

class Credential {

    readonly #id;
    readonly #pass;

    constructor(id: string, pass: string) {
        this.#id = id;
        this.#pass = pass;
    }

    get id(): string {
        return this.#id;
    }

    get pass(): string {
        return this.#pass;
    }

    asRequest() {
        return {"id": this.#id, "pass": this.#pass};
    }

}