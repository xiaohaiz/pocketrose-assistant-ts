class PageProcessorContext {

    readonly #context: Map<string, string>;

    constructor() {
        this.#context = new Map<string, string>();
    }

    set(key: string, value: string): PageProcessorContext {
        this.#context.set(key, value);
        return this;
    }

    get(key: string): string | undefined {
        return this.#context.get(key);
    }
}

export = PageProcessorContext;