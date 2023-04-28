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

    asRequest(): Map<string, string> {
        const request = new Map<string, string>();
        request.set("id", this.#id);
        request.set("pass", this.#pass);
        return request;
    }

}