class PageProcessorContext {

    readonly #context: Map<string, string>;

    constructor() {
        this.#context = new Map<string, string>();
    }

    set(key: string, value: string | undefined): PageProcessorContext {
        if (value !== undefined) {
            this.#context.set(key, value);
        }
        return this;
    }

    get(key: string): string | undefined {
        return this.#context.get(key);
    }

    static withTownId2(townId: string | undefined) {
        const context = new PageProcessorContext();
        if (townId !== undefined) {
            context.set("townId", townId);
        }
        return context;
    }

    static withCastleName2(castleName: string | undefined) {
        const context = new PageProcessorContext();
        if (castleName !== undefined) {
            context.set("castleName", castleName);
        }
        return context;
    }
}

export = PageProcessorContext;