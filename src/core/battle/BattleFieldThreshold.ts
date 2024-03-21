class BattleFieldThreshold {

    a?: number;
    b?: number;
    c?: number;

    asDocument(): {} {
        const document = {};
        // @ts-ignore
        document["a"] = this.a;
        // @ts-ignore
        document["b"] = this.b;
        // @ts-ignore
        document["c"] = this.c;
        return document;
    }

    static defaultInstance(): BattleFieldThreshold {
        const inst = new BattleFieldThreshold();
        inst.a = 100;
        inst.b = 300;
        inst.c = 500;
        return inst;
    }
}

export = BattleFieldThreshold;