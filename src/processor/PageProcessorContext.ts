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

    static withTownId(townId: string | undefined) {
        const context = new PageProcessorContext();
        if (townId !== undefined) {
            context.set("townId", townId);
        }
        return context;
    }

    static withCastleName(castleName: string | undefined) {
        const context = new PageProcessorContext();
        if (castleName !== undefined) {
            context.set("castleName", castleName);
        }
        return context;
    }
}

export = PageProcessorContext;