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

    withTownId(townId: string | undefined): PageProcessorContext {
        if (townId !== undefined) {
            this.set("townId", townId);
        }
        return this;
    }

    withBattleCount(battleCount: string | undefined): PageProcessorContext {
        if (battleCount !== undefined) {
            this.set("battleCount", battleCount);
        }
        return this;
    }

    withCastleName(castleName: string | undefined): PageProcessorContext {
        if (castleName !== undefined) {
            this.set("castleName", castleName);
        }
        return this;
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